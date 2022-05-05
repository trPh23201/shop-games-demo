import Link from "next/link";
import { useRouter } from "next/router";
import { Col, Row, Stack } from "react-bootstrap";
import style from "../../styles/Choose.module.css";

export default function Choose() {
    const router = useRouter()
    const { pathname } = router;
    const { asPath } = router

    return (
        <Row>
            <Col sm={4}>
                <Stack direction="horizontal" gap={3}>
                    <Link href={pathname === '/management/accounts' ? asPath : '/management/accounts'} passHref>
                        <span className={pathname === '/management/accounts' ?
                            `${style.text} ${style.active}` :
                            `${style.text} ${style.inactive}`}>
                            Accounts
                        </span>
                    </Link>
                    <Link href={pathname === '/management/games' ? asPath : '/management/games'} passHref>
                        <span className={pathname === '/management/games' ?
                            `${style.text} ${style.active}` :
                            `${style.text} ${style.inactive}`}>
                            Games
                        </span>
                    </Link>
                </Stack>
            </Col>
        </Row>
    )
}