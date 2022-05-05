import style from "../styles/Product_detail.module.css"
import { fetchGames } from "../const/fetch";
import Layout from "../components/Layout";
import Reviews from "../components/product_detail/Reviews";
import Game from "../components/product_detail/Game";
import PostReview from "../components/product_detail/PostReview";
import Sort from "../components/product_detail/sort";
import { useState } from "react";

export default function Product({ gameItem }) {
    const [game, setGame] = useState(gameItem)

    function renderAbout(text) {
        return text.map((el, key) => (
            <span key={key} >{el} <br /><br /></span>
        ))
    }

    return (
        <Layout>
            <div className={style.layout}>
                <h1 className={style.h1}>{game.name}</h1>
                <Game game={game} />
                <h1 className={style.h1}>ABOUT THIS GAME</h1>
                <p>
                    {renderAbout(game.intro)}
                </p>
                <>
                    <h1 className={style.h1}>SYSTEM REQUIREMENTS</h1>
                    <p>OS: {game.requirements.os}</p>
                    <p>Processor: {game.requirements.processor}</p>
                    <p>Memory: {game.requirements.memory}</p>
                    <p>Graphics: {game.requirements.graphics}</p>
                    <p>DirectX: {game.requirements.directx}</p>
                    <p>Storage: {game.requirements.storage}</p>
                </>
                <h1 className={style.h1}>CUSTOMER REVIEWS</h1>
                <PostReview game={game} setGame={(val) => setGame(val)} />
                <Sort game={game} setGame={(val) => setGame(val)} />
                <Reviews game={game} />
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    const res = await fetchGames(`id=${id}&_embed=reviews`)
    const gameItem = res[0]
    gameItem.reviews.sort((a, b) => {
        const count1 = new Date(a.created).getTime();
        const count2 = new Date(b.created).getTime();
        return count2 - count1
    })
    if (!gameItem) return { notFound: true }

    return {
        props: {
            gameItem,
        }
    }
}