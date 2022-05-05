import { Badge, Col, Row } from "react-bootstrap";
import style from '../../styles/Purchased.module.css'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { resignToken, verifyToken } from "../../const/auth.js";
import { getCookie } from "../../const/cookie";
import { useRouter } from "next/router";
import { fetchPurchased } from "../../const/fetch";

export default function Purchased({ token, setToken, viewUser }) {
    const [games, setGames] = useState([])
    const totalRef = useRef(0)
    const router = useRouter()

    useEffect(() => {
        totalRef.current = 0
        const data = verifyToken(token)
        if (data) {
            async function getPurchased(id) {
                const pur = await fetchPurchased(viewUser ? viewUser.id : id)
                setGames(pur)
            }
            getPurchased(data.id)
        } else {
            resignToken()
            setToken(getCookie("token"))
        }
    }, [token, setToken, viewUser])

    function renderDate(jsonDate) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(jsonDate)
        let month = months[d.getMonth()];
        return `${d.getDate()} ${month}, ${d.getFullYear()}`
    }

    function renderGames() {
        return games.map((game, key) => {
            totalRef.current += game.price
            return (
                <Row className={style.item} key={key}>
                    <Col className={style.img_frame} sm={4} onClick={() => router.push(`/product_detail?id=${game.gameId}`)}>
                        <Image priority src={game.image} layout="fill" alt={game.name} ></Image>
                    </Col>
                    <Col sm={8}>
                        <h4><Badge bg="success" >{game.name}</Badge></h4>
                        <h5><Badge bg="dark" >Price: {game.price}$</Badge></h5>
                        <h5><Badge bg="dark" >Purchased date: {renderDate(game.date)}</Badge></h5>
                    </Col>
                </Row>
            )
        })
    }

    return (
        <>
            {viewUser?.hide.purchased ? <h2 style={{ color: 'gray', textAlign: 'center' }}>User&apos;s purchased can&apos;t be found</h2> :
                <>

                    {games.length !== 0 ? <h2 style={{ textAlign: 'right' }} >Total paid: {totalRef.current.toFixed(2)}$</h2> : ''}
                    {renderGames()}
                    {games.length === 0 && !viewUser?.hide.purchased ? <h2 style={{ color: 'gray', textAlign: 'center' }}>No game in purchased</h2> : ''}
                </>
            }
        </>
    )
}