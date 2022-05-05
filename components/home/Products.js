import { Col, Row, Card, Button, Badge } from "react-bootstrap";
import Link from "next/link";
import style from "../../styles/Products.module.css"
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addProduct } from "../../features/reducerCart";
import { toggleCart } from "../../features/reducerShowCart";

export default function Products({ games, colSm }) {
    const router = useRouter()
    const { asPath } = router
    const dispatch = useDispatch()

    function handleCart(game) {
        dispatch(addProduct(game))
        dispatch(toggleCart(true))
    }

    function renderTags(tags) {
        return tags.map((tag, key) => (
            <Link href={router.pathname === '/home/browsers' ? asPath : `/home/browsers?_page=1&_limit=15&_sort=selltime&_order=desc&tag=${tag}`} passHref key={key}>
                <span className={router.pathname === '/home/browsers' ? style.cate_item_disable : style.cate_item}>
                    <Badge bg="primary">{tag}</Badge>{' '}
                </span>
            </Link>
        ))
    }

    function renderGames() {
        if (games.length === 0) {
            return (
                <h1 style={{ textAlign: "center", color: "white" }}>No games found</h1>
            )
        }

        return games?.map(game => (
            <Col sm={colSm} key={game.id}>
                <Card className={style.item}>
                    <Card.Img variant="top" src={game.image} className={style.image} onClick={() => router.push(`/product_detail?id=${game.id}`)} />
                    <Card.Body>
                        <Card.Title className={style.name}>{game.name}</Card.Title>
                        <div className={style.cate}>
                            {renderTags(game.tags)}
                        </div>
                        <div className={style.price_button}>
                            <span className={style.price}>{game.price}$</span>&ensp;
                            <Button className={style.button} size="sm" variant="success" onClick={() => handleCart(game)}>Add to cart</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ))
    }


    return (
        <Row className={style.products}>
            {renderGames()}
        </Row>
    )
}
