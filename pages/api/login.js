// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken"

export default function handler(req, res) {
    const { email, password } = req.body

    res.status(200).json({
        token: ''
    })

    res.status(201).json({
        token: jwt.sign({
            email,
            password
        }, 'shhhh')
    })
}
