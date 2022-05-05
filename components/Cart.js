import { Modal, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import style from "../styles/Cart.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs"
import { useDispatch } from "react-redux";
import { remove, removeAll } from "../features/reducerCart";
import { useSelector } from "react-redux";
import { toggleCart } from "../features/reducerShowCart";
import { buyGames, resignToken, updateTotalPaid, verifyToken } from "../const/auth";
import { getCookie } from "../const/cookie";
import { fetchPurchased } from "../const/fetch";
import { useState } from "react";

export default function Cart({ token, setToken }) {
    const cart = useSelector(state => state.cart);
    const show = useSelector(state => state.showCart);
    const [spin, setSpin] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    async function handleBuy(token) {
        if (cart.length === 0) alert('Nothing to buy')
        else if (token) {
            setSpin(true)
            const data = verifyToken(token);
            if (data) {
                const pur = await fetchPurchased(data.id)
                const str = '';
                cart?.map(el1 => {
                    pur?.forEach(el2 => {
                        if (el1.id === el2.gameId) str += `${el1.name}, `
                    })
                });
                if (str === '') {
                    cart?.forEach(game => {
                        buyGames(game, data.id)
                    });
                    updateTotalPaid(data.id, totalPrice)
                    setTimeout(() => {
                        alert('Thank you!')
                        setSpin(false)
                        dispatch(removeAll())
                    }, 1000)
                } else {
                    alert(`${str.slice(0, -2)} already purchased please remove`)
                    setSpin(false)
                }
            } else {
                resignToken()
                setToken(getCookie("token"))
                handleBuy(getCookie("token"))
            }
        } else alert('You must login first!')
    }

    function handlePush(id) {
        dispatch(toggleCart(false))
        router.push(`/product_detail?id=${id}`)
    }

    var totalPrice = 0;
    function renderGame() {
        return cart?.map((el, key) => {
            totalPrice += el.price
            return (
                <Row className={style.row} key={key}>
                    <Col sm={4} className={style.img_frame}>
                        <Image priority src={el.image} layout="fill" alt={el.name} onClick={() => handlePush(el.id)} ></Image>
                    </Col>
                    <Col sm={5} >
                        <h4>{el.name}</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>{el.price}$</h4>
                    </Col>
                    <Col sm={1}>
                        <Button variant="danger" onClick={() => dispatch(remove(el.id))}>
                            <BsFillTrashFill className={style.remove} />
                        </Button>
                    </Col>
                </Row>
            )
        })
    }

    return (
        <Modal
            show={show}
            onHide={() => dispatch(toggleCart(false))}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Cart
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    {renderGame()}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <h4>Total price: {totalPrice.toFixed(2)}$</h4>&emsp;
                {spin ?
                    <Button variant="success" disabled>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        {' '}Buy....
                    </Button> :
                    <Button variant="success" onClick={() => handleBuy(token)} >Buy now</Button>
                }
                <Button variant="warning" onClick={() => dispatch(removeAll())}>Remove all</Button>
            </Modal.Footer>
        </Modal>
    );
}