import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { resignToken, updateProfile, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";
import { rsaDecrypt, rsaEncrypt } from "../../const/rsa";
import style from "../../styles/Settings.module.css"

export default function Settings({ token, setToken }) {
    const [userData, setUserData] = useState(null)
    const [userId, setUserid] = useState(null)
    const [phone, setPhone] = useState(false)
    const [birthday, setBirthday] = useState(false)
    const [purchased, setPurchased] = useState(false)
    const [reviews, setReviews] = useState(false)
    const [wishlist, setWishlist] = useState(false)

    useEffect(() => {
        const data = verifyToken(token)
        if (data) {
            setUserData(data)
            setUserid(data.id)
            setPhone(data.hide.phone)
            setBirthday(data.hide.birthday)
            setPurchased(data.hide.purchased)
            setReviews(data.hide.reviews)
            setWishlist(data.hide.wishlist)
        } else {
            resignToken()
            setToken(getCookie("token"))
        }
    }, [token, setToken])

    function handleSave(type) {
        if (type === 'phone') {
            updateProfile(userId, {
                phone: phone ? rsaDecrypt(userData.phone) : rsaEncrypt(userData.phone),
                hide: { phone: !phone, birthday, purchased, reviews, wishlist }
            }, 'rsaHide')
            setPhone(!phone)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
        if (type === 'birthday') {
            updateProfile(userId, {
                birthday: birthday ? rsaDecrypt(userData.birthday) : rsaEncrypt(userData.birthday),
                hide: { phone, birthday: !birthday, purchased, reviews, wishlist }
            }, 'rsaHide')
            setBirthday(!birthday)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
        if (type === 'reviews') {
            updateProfile(userId, { phone, birthday, purchased, reviews: !reviews, wishlist }, 'hide')
            setReviews(!reviews)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
        if (type === 'purchased') {
            updateProfile(userId, { phone, birthday, purchased: !purchased, reviews, wishlist }, 'hide')
            setPurchased(!purchased)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
        if (type === 'wishlist') {
            updateProfile(userId, { phone, birthday, purchased, reviews, wishlist: !wishlist }, 'hide')
            setWishlist(!wishlist)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
    }

    return (
        <div>
            <Row className={phone ? style.setting_active : style.setting}>
                <Col sm={10}>
                    <h4  >Hide phone number</h4>
                </Col>
                <Col sm={2} className={style.switch_frame} >
                    <Form.Check
                        checked={phone ? true : false}
                        className={style.switch}
                        type="switch"
                        id="custom-switch"
                        onChange={() => handleSave('phone')}
                    />
                </Col>
            </Row>
            <Row className={birthday ? style.setting_active : style.setting} >
                <Col sm={10}>
                    <h4 >Hide birthday</h4>
                </Col>
                <Col sm={2} className={style.switch_frame} >
                    <Form.Check
                        checked={birthday ? true : false}
                        className={style.switch}
                        type="switch"
                        id="custom-switch"
                        onChange={() => handleSave('birthday')}
                    />
                </Col>
            </Row>
            <Row className={purchased ? style.setting_active : style.setting}>
                <Col sm={10}>
                    <h4 >Hide purchased</h4>
                </Col>
                <Col sm={2} className={style.switch_frame} >
                    <Form.Check
                        checked={purchased ? true : false}
                        className={style.switch}
                        type="switch"
                        id="custom-switch"
                        onChange={() => handleSave('purchased')}
                    />
                </Col>
            </Row>
            <Row className={reviews ? style.setting_active : style.setting}>
                <Col sm={10}>
                    <h4 >Hide all reviews</h4>
                </Col>
                <Col sm={2} className={style.switch_frame} >
                    <Form.Check
                        checked={reviews ? true : false}
                        className={style.switch}
                        type="switch"
                        id="custom-switch"
                        onChange={() => handleSave('reviews')}
                    />
                </Col>
            </Row>
            <Row className={wishlist ? style.setting_active : style.setting}>
                <Col sm={10}>
                    <h4 >Hide wishList</h4>
                </Col>
                <Col sm={2} className={style.switch_frame} >
                    <Form.Check
                        checked={wishlist ? true : false}
                        className={style.switch}
                        type="switch"
                        id="custom-switch"
                        onChange={() => handleSave('wishlist')}
                    />
                </Col>
            </Row>
        </div>
    )
}