import jwt from "jsonwebtoken"
import { eraseCookie, getCookie, setCookie } from "./cookie";
import { secretRFKey, rfTokenLife, secretKey, tokenLife } from "./key";
import { rsaDecrypt, rsaEncrypt } from "./rsa";
const endPoint = 'http://localhost:4000';

export const login = async (email, password, router) => {
    try {
        const res = await fetch(`${endPoint}/users?email=${email}&password=${rsaEncrypt(password)}`)
        const data = await res.json()
        if (data.length === 1) {
            if (data[0].blocked) alert('Your account is blocked please contact to admin');
            else {
                const { id, name, blocked, admin, phone, gender, birthday, created, hide } = data[0];
                const userObj = { id, email, name, blocked, admin, phone, gender, birthday, created, hide }
                setCookie("token", JSON.stringify(jwt.sign(userObj, secretKey, { expiresIn: tokenLife })), 1)
                localStorage.setItem("refresh", JSON.stringify(jwt.sign(userObj, secretRFKey, { expiresIn: rfTokenLife })))
                router && router.push('/home/discover')
            }
        } else alert('Wrong user name or password');
    } catch (error) {
        console.error('Error:', error);
    }
}

export const register = async (email, password, router) => {
    const res = await fetch(`${endPoint}/users?email=${email}`)
    const data = await res.json()
    if (data.length === 0) {
        fetch(`${endPoint}/users`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                name: "",
                email,
                password: rsaEncrypt(password),
                blocked: false,
                admin: false,
                gender: '',
                birthday: '',
                created: (new Date()).toJSON(),
                phone: "",
                totalPaid: 0,
                hide: {
                    phone: false,
                    birthday: false,
                    purchased: false,
                    reviews: false,
                    wishlist: false
                }
            })
        }).catch((error) => {
            console.error('Error:', error);
        }).then(res => res.json()).then(data => {
            login(data.email, rsaDecrypt(data.password), null)
            router.push('/profile')
        })
    } else alert('Email in use');
}

export const resignToken = () => {
    jwt.verify(JSON.parse(localStorage.getItem("refresh")), secretRFKey, (err, dec) => {
        if (err) {
            eraseCookie("token")
            localStorage.removeItem("refresh")
        } else {
            const decoded = jwt.decode(JSON.parse(getCookie("token"))); //Check refresh token must same id with current token
            const { id, email, name, blocked, admin, phone, gender, birthday, created, hide } = dec;
            const userObj = { id, email, name, blocked, admin, phone, gender, birthday, created, hide }
            if (decoded.id === id) setCookie("token", JSON.stringify(jwt.sign(userObj, secretKey, { expiresIn: tokenLife })), 1)
            else {
                alert('token and refresh token are different!')
                eraseCookie("token")
                localStorage.removeItem("refresh")
            }
        }
    })
}

export function verifyToken(token) {
    return jwt.verify(JSON.parse(token), secretKey, (err, dec) => {
        if (err) {
            // console.log("err: " + err.name); 
            if (err.name !== 'TokenExpiredError') {
                eraseCookie("token")
                localStorage.removeItem("refresh")
            }
        } else {
            return dec;
        }
    })
}

export async function updateProfile(id, value, type) {
    try {
        const res = await fetch(`${endPoint}/users?id=${id}`)
        const data = await res.json()
        if (type === 'name') data[0].name = value
        else if (type === 'phone') data[0].phone = value
        else if (type === 'gender') data[0].gender = value
        else if (type === 'birthday') data[0].birthday = value
        else if (type === 'hide') data[0].hide = value
        else if (type === 'rsaHide') {
            data[0][Object.keys(value)[0]] = value[Object.keys(value)[0]]
            data[0].hide = value.hide
        }

        fetch(`${endPoint}/users/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(data[0])
        }).catch((error) => {
            console.error('Error:', error);
        }).then(res => res.json()).then(dataRes => {
            login(dataRes.email, rsaDecrypt(dataRes.password), null)
        })
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function buyGames(game, userId) {
    const { name, price, image, id } = game;
    fetch(`${endPoint}/purchased`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            name,
            price,
            date: (new Date()).toJSON(),
            image,
            gameId: id,
            userId
        })
    }).catch((error) => {
        console.error('Error:', error);
    })

    //Update selltime
    const res = await fetch(`${endPoint}/games?id=${id}`)
    const data = await res.json()
    fetch(`${endPoint}/games/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ ...data[0], selltime: data[0].selltime + 1 })
    }).catch((error) => {
        console.error('Error:', error);
    })
}

export async function updateTotalPaid(userId, total) {
    //Update total user
    const res = await fetch(`${endPoint}/users?id=${userId}`)
    const data = await res.json()
    fetch(`${endPoint}/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ ...data[0], totalPaid: data[0].totalPaid + total })
    }).catch((error) => {
        console.error('Error:', error);
    })
}

export function addWish(game, userId) {
    const { name, price, image, id } = game;
    fetch(`${endPoint}/wishlist`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            name,
            price,
            image,
            gameId: id,
            userId
        })
    }).catch((error) => {
        console.error('Error:', error);
    })
}

export function removeWish(id) {
    fetch(`${endPoint}/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    })
}

export function postComment(review) {
    fetch(`${endPoint}/reviews`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(review)
    }).catch((error) => {
        console.error('Error:', error);
    })
}

export function removeComment(id) {
    fetch(`${endPoint}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    })
}

export async function fetchUser(param) {
    const res = await fetch(`${endPoint}/users?id=${param}`)
    const data = await res.json()
    const { id, email, name, phone, gender, birthday, created, hide } = data[0];
    const userObj = { id, email, name, phone, gender, birthday, created, hide };
    return userObj;
}

export async function fetchAllUser() {
    try {
        const res = await fetch(`${endPoint}/users`)
        const data = await res.json()
        return data;
    } catch {
        return null
    }
}

export async function updateLockAndUnlock(userId) {
    //Update total user
    const res = await fetch(`${endPoint}/users?id=${userId}`)
    const data = await res.json()
    fetch(`${endPoint}/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify({ ...data[0], blocked: data[0].blocked ? false : true })
    }).catch((error) => {
        console.error('Error:', error);
    })
}