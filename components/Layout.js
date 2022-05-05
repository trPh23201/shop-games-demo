import Head from "next/head"
import { Container } from "react-bootstrap"
import MenuBar from "./MenuBar"

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Discover</title>
            </Head>
            <header>
                <MenuBar></MenuBar>
            </header>
            <Container>
                <main>{children}</main>
            </Container>
        </>
    )
}