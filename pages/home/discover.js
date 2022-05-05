import Choose from "../../components/home/Choose";
import Layout from "../../components/Layout";
import BestSeller from "../../components/home/discover/BestSeller";
import Products from "../../components/home/Products";
import Head from "next/head";
import { Row } from "react-bootstrap";
import { fetchGames } from "../../const/fetch";

export default function Discover({ games }) {

    return (
        <Layout>
            <Head><title>Discover</title></Head>
            <div style={{ marginTop: "20px" }}>
                <Choose />
                <BestSeller games={games} />
                <Row style={{marginTop: "15px"}}>
                    <Products games={games} colSm={3} />
                </Row>
            </div>
        </Layout>
    )
}

export async function getServerSideProps() {
    const games = await fetchGames('_sort=selltime&_order=desc')
    if (!games) return { notFound: true }

    return {
        props: {
            games,
        }
    }
}