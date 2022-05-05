import { useState, useEffect } from "react"
import { Modal, Button, Form, Stack } from "react-bootstrap"
import { register } from "../const/auth"
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const router = useRouter()

    useEffect(()=>{
        const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("token")) : null
        token && router.push('home/discover')
    })

    async function handleRegister() {
        if (password !== confirm) alert("Password and confirm password doesn't match")
        else if (password.length < 6) alert("Password must be atleast 6 characters or above")
        else register(email, password, router)
    }

    return (
        <Modal.Dialog style={{ marginTop: '5.25rem' }}  >
            <Modal.Header>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirm">
                        <Form.Label>Confirm password:</Form.Label>
                        <Form.Control onChange={e => setConfirm(e.target.value)} value={confirm} type="password" placeholder="Re-enter password" />
                    </Form.Group>
                </Form>
                <Stack className="col-md-4 mx-auto">
                    <Button style={{ float: "right" }} variant="success" onClick={() => handleRegister()}>
                        Register
                    </Button>
                </Stack>
                <div style={{ textAlign: "center", marginTop: '10px' }} >
                    <Link href='/home/discover' passHref><a>Go to home page</a></Link>&emsp;
                    <Link href='/login' passHref><a>Areally have acount?</a></Link>
                </div>
            </Modal.Body>
        </Modal.Dialog>
    )
}