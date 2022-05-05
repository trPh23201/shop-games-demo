import { Col, Row, Badge, Button, ToastContainer, Toast, Spinner } from "react-bootstrap";
import Image from "next/image";
import style from "../../styles/WishList.module.css"
import { BsTrashFill, BsCartPlusFill } from "react-icons/bs"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetWishlist } from "../../const/fetch";
import { removeWish, resignToken, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";
import { useDispatch } from "react-redux";
import { addProduct } from "../../features/reducerCart";
import { toggleCart } from "../../features/reducerShowCart";

export default function WishList({ token, setToken, viewUser }) {
    const [games, setGames] = useState([])
    const [backup, setBackup] = useState(null)
    const [pop, setPop] = useState('')
    const [removing, setRemoving] = useState(false)
    const timerRef = useRef(null);
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const data = verifyToken(token)
        if (data) {
            async function getWishlist(id) {
                const wish = await fetWishlist(viewUser ? viewUser.id : id)
                setGames(wish)
            }
            getWishlist(data.id)
        } else {
            resignToken()
            setToken(getCookie("token"))
        }
    }, [token, setToken, viewUser])

    function findIndex(state, id) {
        var temp = -1;
        state.forEach((st, index) => {
            if (st.gameId === id) temp = index;
        })
        return temp
    }

    function handleCancel() {
        setGames(backup)
        setPop('')
        setRemoving(false)
        clearTimeout(timerRef.current);
    }

    function handleRemove(id, name, wishId) {
        if (!removing) {
            setPop(name)
            setBackup(games)
            const index = findIndex(games, id)
            var arr = [...games]
            arr.splice(index, 1)
            setGames(arr)
            setRemoving(true)
            timerRef.current = setTimeout(() => {
                removeWish(wishId)
                setPop('')
                setRemoving(false)
            }, 3000)
        }
    }

    function handleCart(game) {
        console.log(game);
        dispatch(addProduct({ ...game, id: game.gameId }))
        dispatch(toggleCart(true))
    }

    function renderGames() {
        return games.map((game, key) => (
            <Row className={style.item} key={key}>
                <Col className={style.img_frame} sm={4} onClick={() => router.push(`/product_detail?id=${game.gameId}`)}>
                    <Image priority src={game.image} layout="fill" alt={game.name} ></Image>
                </Col>
                <Col sm={7}>
                    <h4><Badge bg="success" >{game.name}</Badge></h4>
                    <h5><Badge bg="dark" >Price: {game.price}$</Badge></h5>
                </Col>
                <Col sm={1}>
                    <Button variant="danger" disabled={viewUser ? true : false} onClick={() => handleRemove(game.gameId, game.name, game.id)}><BsTrashFill /></Button>
                    <Button variant="primary" disabled={viewUser ? true : false} onClick={() => handleCart(game)}><BsCartPlusFill /></Button>
                </Col>
            </Row>
        ))
    }

    return (
        <>
            {viewUser?.hide.wishlist ? <h2 style={{ color: 'gray', textAlign: 'center' }}>User&apos;s wishlist can&apos;t be found</h2> :
                <>
                    {renderGames()}
                    {games.length === 0 && !viewUser?.hide.wishlist ? <h2 style={{ color: 'gray', textAlign: 'center' }}>No game in wishlist</h2> : ''}
                    {pop !== '' &&
                        <div className={style.pop} >
                            <ToastContainer className="p-3" position="bottom-end">
                                <Toast className={style.body}>
                                    <Toast.Header closeButton={false}>
                                        <Spinner animation="border" size="sm" />&emsp;
                                        <strong className="me-auto">
                                            Removing {pop} ...
                                        </strong>
                                        <small>
                                            <Button variant="dark" size="sm" onClick={() => handleCancel()}>Cancel</Button>
                                        </small>
                                    </Toast.Header>
                                </Toast>
                            </ToastContainer>
                        </div>
                    }
                </>
            }
        </>
    )
}