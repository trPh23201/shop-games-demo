import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import Layout from "../../components/Layout";
import Choose from "../../components/management/Choose";
import { fetchAllUser, resignToken, updateLockAndUnlock, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";
import style from "../../styles/Accounts.module.css";
import { useRouter } from "next/router";
import { rsaDecrypt } from "../../const/rsa";

export default function Acc({ tokenn }) {
    const router = useRouter()
    const [token, setToken] = useState(tokenn)
    const [show, setShow] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!token) router.push('/home/discover')
        const data = verifyToken(token)
        if (data) {
            if (!data.admin) router.push('/home/discover')
            if (data.admin) {
                setTimeout(() => {
                    async function getAllUsers() {
                        const users = await fetchAllUser();
                        setUsers(users)
                    }
                    getAllUsers()
                    setShow(true)
                }, 3000)
            }
        } else {
            resignToken()
            setToken(getCookie('token'))
        }
    }, [token, router, setToken, show, setShow])

    function renderCreated(jsonDate) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(jsonDate)
        let month = months[d.getMonth()];
        return `${d.getDate()} ${month}, ${d.getFullYear()}`
    }

    function renderAccounts() {
        return users?.map((user, key) => (
            <tr key={key}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.gender === '' ? 'Unknown' : user.gender}</td>
                <td>{user.email}</td>
                <td>{user.hide.phone ? rsaDecrypt(user.phone) : user.phone}</td>
                <td>{user.hide.birthday ? rsaDecrypt(user.birthday) : user.birthday}</td>
                <td>{renderCreated(user.created)}</td>
                <td>{user.totalPaid}$</td>
                {
                    user.blocked ?
                        <td><Button size="sm" variant="success" onClick={() => handleUser(key)} className={style.button}>Unlock</Button></td>
                        :
                        <td><Button size="sm" variant="danger" onClick={() => handleUser(key)} className={style.button}>&ensp;Lock&ensp;</Button></td>
                }
            </tr>
        ))
    }

    function handleUser(index) {
        const temp = [...users]
        temp[index].blocked = temp[index].blocked ? false : true
        updateLockAndUnlock(temp[index].id)
        setUsers(temp)
    }

    return (
        <Layout>
            {show ?
                <>
                    <Head><title>Management | Accounts</title></Head>
                    <div style={{ marginTop: "20px" }}>
                        <Choose />
                        <Table responsive striped bordered hover variant="dark" className={style.table}>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Birthday</th>
                                    <th>Created</th>
                                    <th>Total paid</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderAccounts()}
                            </tbody>
                        </Table>
                    </div>
                </> :
                <div style={{ color: 'white', textAlign: 'center', marginTop: '10%' }}>
                    <Spinner animation="border" />
                </div>
            }
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const tokenn = context.req.cookies.token;
    if (!tokenn) return { redirect: { destination: '/home/discover' } }

    return {
        props: {
            tokenn: JSON.stringify(tokenn)
        }
    }
}