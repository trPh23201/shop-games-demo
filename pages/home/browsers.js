import Choose from "../../components/home/Choose";
import Layout from "../../components/Layout"
import Head from "next/head";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Products from "../../components/home/Products";
import TagList from "../../components/home/browsers/TagList";
import { fetchCountByTag, fetchCountGames, fetchGames, fetchTags } from "../../const/fetch";
import SortDropdown from "../../components/home/browsers/SortDropdown";
import Pagination from "../../components/home/browsers/Pagination";
import { useRouter } from "next/router";
import { queryByEnterUrl, queryByScrollPagi } from "../../const/query";

export default function Browsers({ gamesList, tags, count, count2 }) {
    const [games, setGames] = useState(gamesList)
    const [page, setPage] = useState(2)
    const [countByTag, setCountByTag] = useState(count2.countGames)
    const router = useRouter()
    const { _page, _limit, _sort, _order, tag, name } = router.query;

    async function loadmoreGames() {
        var queryString = queryByScrollPagi(_page, _limit, _sort, _order, tag, name, page)
        const data = await fetchGames(queryString)
        console.log(tag ,queryString ,data);
        if (data.length !== 0) {
            setPage(page + 1)
            setGames((prev) => [...prev, ...data])
        }
    }

    useEffect(() => {
        let fetching = false
        const handleScroll = async (e) => {
            if (!fetching && (e.target.documentElement.scrollTop + window.innerHeight + 100) >= e.target.documentElement.scrollHeight) {
                fetching = true
                await loadmoreGames()
                fetching = false
            }
        }
        name && window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll) 
    })

    return (
        <Layout>
            <Head><title>Browsers</title></Head>
            <div style={{ marginTop: "20px" }}>
                <Choose setGames={(data) => setGames(data)} setPage={()=>setPage(2)} />
                <Row>
                    <Col sm={9}>
                        <Row>
                            <SortDropdown setGames={(data) => setGames(data)} setPage={()=>setPage(2)}/>
                            <Products games={games} colSm={4} />
                            {name || games.length === 0 ? '' : <Pagination count={countByTag > 0 ? countByTag : count.countGames} setGames={(data) => setGames(data)}/>}
                        </Row>
                    </Col>
                    <Col sm={3}>
                        <TagList tags={tags} setCountByTag={(count) => setCountByTag(count)} setGames={(data) => setGames(data)} setPage={()=>setPage(2)} />
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { _page, _limit, _sort, _order, tag, name } = context.query;
    var queryString = queryByEnterUrl(_page, _limit, _sort, _order, tag, name)
    const gamesList = await fetchGames(queryString)
    const tags = await fetchTags()
    const count = await fetchCountGames()
    const count2 = await fetchCountByTag(tag); //When user enter url have tag=....
    if (!gamesList || !tags) return { notFound: true }
    if (!_page || !_limit || !_sort || !_order) //when user enter url /home/browsers
        return { redirect: { destination: '/home/browsers?_page=1&_limit=15&_sort=selltime&_order=desc' } }

    return {
        props: {
            gamesList,
            tags,
            count: count,
            count2: tag ? count2[0] : 0
        }
    }
}

