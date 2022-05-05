import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addProduct } from "../../features/reducerCart";
import { toggleCart } from "../../features/reducerShowCart";
import { addWish, resignToken, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";
import { useState } from "react";
import { fetWishlist } from "../../const/fetch";
import style from "../../styles/Game.module.css"

export default function Game({ game }) {
    const dispatch = useDispatch()
    const [spin, setSpin] = useState(false)

    function handleCart() {
        dispatch(addProduct(game))
        dispatch(toggleCart(true))
    }

    async function handleWish() {
        setSpin(true)
        const token = getCookie('token')
        const data = verifyToken(token)
        if (data) {
            const wish = await fetWishlist(data.id)
            var str = ''
            wish?.forEach(el => {
                if (el.gameId === game.id) str += `${el.name}`
            })
            if (str === '') {
                addWish(game, data.id)
                setTimeout(() => { setSpin(false) }, 1000)
            } else {
                alert(`${str} is already in wishlist`)
                setTimeout(() => { setSpin(false) }, 1000)
            }
        } else {
            resignToken()
            handleWish(game)
        }
    }

    function renderTags(tags) {
        return tags.map((tag, key) => (
            <Link href={`/home/browsers?_page=1&_limit=15&_sort=selltime&_order=desc&tag=${tag}`} passHref key={key}>
                <span >
                    <Badge bg="primary">{tag}</Badge>{' '}
                </span>
            </Link>
        ))
    }

    function renderRelease(jsonDate) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(jsonDate)
        let month = months[d.getMonth()];
        return `${d.getDate()} ${month}, ${d.getFullYear()}`
    }

    return (
        <Row className={style.row}>
            <Col sm={9} className={style.img_frame}>
                <Image priority src={game.image} layout="fill" alt={game.image}></Image>
            </Col>
            <Col sm={3} className={style.detail}>
                <p>Realeased date: <Badge bg="success">{renderRelease(game.realeased)}</Badge></p>
                <p>Price: <Badge bg="warning" className={style.price}>{game.price}$</Badge></p>
                <div className={style.tag_frame}>
                    <strong>Tags: </strong>
                    {renderTags(game.tags)}
                </div>
                <div className={style.develop}>
                    <p>Developer: <Badge bg="success">{game.developer}</Badge></p>
                    <p>Publisher: <Badge bg="success">{game.publisher}</Badge></p>
                </div>
                <Button variant="outline-danger" onClick={() => handleCart()}>Add to cart</Button>&ensp;
                {spin ?
                    <Button variant="warning" disabled>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        {' '}Adding ........
                    </Button> :
                    <Button variant="outline-warning" onClick={() => handleWish()}>Add to wishlist</Button>
                }
            </Col>
        </Row>
    )
}