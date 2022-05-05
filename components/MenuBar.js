import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { BsBagFill, BsPersonCircle } from "react-icons/bs"
import Cart from "./Cart";
import { toggleCart } from "../features/reducerShowCart";
import { useRouter } from "next/router";
import { resignToken, verifyToken } from "../const/auth";
import { useEffect, useState } from "react";
import { eraseCookie, getCookie } from "../const/cookie";

export default function MenuBar() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [admin, setAdmin] = useState(null)

    useEffect(() => {
        if (token) {
            const data = verifyToken(token);
            if (data) {
                data.name === '' ? setUser(data.email.split("@")[0]) : setUser(data.name)
                setAdmin(data.admin)
            }
            else {
                resignToken()
                setToken(getCookie("token"))
            }
        } else setToken(getCookie("token"))
    }, [token])

    function handleLogout() {
        eraseCookie("token")
        localStorage.removeItem("refresh")
        router.reload()
    }

    function handleProfile() {
        const data = verifyToken(token);
        if (!data) resignToken()
        router.push('/profile')
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Link href='/' passHref><Navbar.Brand>Steam</Navbar.Brand></Link>
                    <Nav className="me-auto">
                        <Link href={`/home/discover`} passHref><Nav.Link>Home</Nav.Link></Link>
                        {admin ? <Link href='/management/accounts' passHref><Nav.Link>Management</Nav.Link></Link> : ''}
                        <Link href='/about' passHref><Nav.Link>About</Nav.Link></Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Link onClick={() => dispatch(toggleCart(true))} >
                            <BsBagFill style={{ verticalAlign: "baseline" }} /> Cart
                        </Nav.Link>&nbsp;
                        {user ?
                            <>
                                <Nav.Link onClick={() => handleProfile()} >
                                    <BsPersonCircle style={{ verticalAlign: "baseline" }} /> {user}
                                </Nav.Link>
                                <Nav.Link onClick={() => handleLogout()} >Logout</Nav.Link>
                            </>
                            :
                            <>
                                <Link href='/login' passHref><Nav.Link>Login</Nav.Link></Link>
                                <Link href='/register' passHref><Nav.Link>Register</Nav.Link></Link>
                            </>
                        }
                    </Nav>
                </Container>
            </Navbar>
            <Cart token={token} setToken={val => setToken(val)} />
        </>
    )
}