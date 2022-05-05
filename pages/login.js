import { useEffect, useState } from "react"
import { Modal, Button, Form, Stack } from "react-bootstrap"
import Link from "next/link";
import { login } from "../const/auth"
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    useEffect(()=>{
        const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("token")) : null
        token && router.push('home/discover')
    })

    async function handleLogin() {
        if (email === '' || password === '') alert("Please enter your email and password")
        else login(email, password, router)
    }

    return (
        <Modal.Dialog style={{ marginTop: '5.25rem' }} >
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ position: 'relative' }} >
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" value={email} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" value={password} />
                    </Form.Group>
                </Form>
                <Stack className="col-md-4 mx-auto">
                    <Button variant="success" onClick={() => handleLogin()}>
                        Login
                    </Button>
                </Stack>
                <div style={{ textAlign: "center", marginTop: '10px' }} >
                    <Link href='/home/discover' passHref><a>Go to home page</a></Link>&emsp;
                    <Link href='/register' passHref><a>Don&apos;t have acount?</a></Link>
                </div>
            </Modal.Body>
        </Modal.Dialog>
    )
}