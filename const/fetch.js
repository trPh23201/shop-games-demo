import axios from "axios";
const endPoint = 'https://db-shopgames.herokuapp.com';
//http://localhost:4000

export const fetchCountGames = async () => {
    try {
        const res = await fetch(`${endPoint}/pagination`)
        return res.json()
    } catch {
        return null
    }
}

export const fetchCountByTag = async (name) => {
    try {
        const res = await fetch(`${endPoint}/tags?name=${name}`)
        return res.json()
    } catch {
        return null
    }
}

export async function fetchGames(queryString) {
    try {
        var res = await axios.get(`${endPoint}/games?${queryString}`)
        return res.data
    } catch {
        return null
    }
}

// export const fetchGames = async (queryString) => {
//     try {
//         const res = await fetch(`${endPoint}/games?${queryString}`)
//         return res.json()
//     } catch {
//         return null
//     }
// }

export const fetchTags = async () => {
    try {
        const res = await fetch(`${endPoint}/tags?_sort=name&_order=esc`)
        return res.json()
    } catch {
        return null
    }
}

export const fetchPurchased = async (id) => {
    try {
        const res = await fetch(`${endPoint}/purchased?userId=${id}`)
        return res.json()
    } catch {
        return null
    }
}

export const fetchReviews = async (userId) => {
    try {
        const res = await fetch(`${endPoint}/reviews?userId=${userId}`)
        return res.json()
    } catch {
        return null
    }
}

export const fetWishlist = async (id) => {
    try {
        const res = await fetch(`${endPoint}/wishlist?userId=${id}`)
        return res.json()
    } catch {
        return null
    }
}

