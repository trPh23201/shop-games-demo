import Layout from "../components/Layout"
import { Col, Row } from "react-bootstrap";
import Info from "../components/profile/info";
import { useEffect, useState } from "react";
import DashBoard from "../components/profile/DashBoard";
import Purchased from "../components/profile/Purchased";
import WishList from "../components/profile/WishList";
import { fetchUser } from "../const/auth";
import Reviews from "../components/profile/Reviews";
import Settings from "../components/profile/Settings";

export default function Profile({ tokenn, anotherUser }) {
    const [token, setToken] = useState(tokenn)
    const [info, setInfo] = useState(true)
    const [purc, setPurc] = useState(false)
    const [revi, setRevi] = useState(false)
    const [wish, setWish] = useState(false)
    const [sett, setSett] = useState(false)
    const [viewUser, setViewUser] = useState(null)

    useEffect(() => {
        if (anotherUser) setViewUser(anotherUser)
    }, [anotherUser])

    function handleClick(type) {
        setInfo(type === 'info' ? true : false)
        setPurc(type === 'purc' ? true : false)
        setRevi(type === 'revi' ? true : false)
        setWish(type === 'wish' ? true : false)
        setSett(type === 'sett' ? true : false)
    }

    const colSize = () => {
        if (info) return 6;
        if (purc) return 8;
        if (revi) return 9;
        if (wish) return 9;
        if (sett) return 6;
    }

    return (
        <Layout>
            <Row style={{ marginTop: '30px' }}>
                <Col sm={3} style={{ color: 'white', marginTop: '20px' }}>
                    <DashBoard
                        handleClick={val => handleClick(val)}
                        info={info}
                        purc={purc}
                        revi={revi}
                        wish={wish}
                        sett={sett}
                        viewUser={viewUser}
                    />
                </Col>
                <Col sm={colSize()} style={{ color: 'white', marginTop: '20px' }}>
                    {info && <Info token={token} setToken={(val) => setToken(val)} viewUser={viewUser} />}
                    {purc && <Purchased token={token} setToken={(val) => setToken(val)} viewUser={viewUser} />}
                    {wish && <WishList token={token} setToken={(val) => setToken(val)} viewUser={viewUser} />}
                    {revi && <Reviews token={token} setToken={(val) => setToken(val)} viewUser={viewUser} />}
                    {sett && <Settings token={token} setToken={(val) => setToken(val)} />}
                </Col>
            </Row>
        </Layout >
    )
}

export async function getServerSideProps(context) {
    const tokenn = context.req.cookies.token;
    const anotherId = context.query;
    var anotherUser = null;
    if (anotherId.id) anotherUser = await fetchUser(anotherId.id)
    if (!tokenn) return { redirect: { destination: '/login' } }

    return {
        props: {
            tokenn: JSON.stringify(tokenn),
            anotherUser,
        }
    }
}