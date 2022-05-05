import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import style from "../../styles/Choose.module.css";
import { fetchGames } from "../../const/fetch";
import { queryBySearch } from "../../const/query";

export default function Choose({ setGames, setPage }) {
    const router = useRouter()
    const { pathname } = router;
    const { asPath } = router
    const { _page, _limit, _sort, _order, tag, name } = router.query;
    const [keyWord, setKeyWord] = useState(name ? name : '')

    async function search(e) {
        if (e.key === 'Enter') {
            if (pathname === '/home/browsers') {
                var queryString = queryBySearch(_page, _limit, _sort, _order, tag, keyWord)
                const data = await fetchGames(queryString)
                setGames(data)
                setPage()
            }
            router.push(
                `/home/browsers?` +
                (
                    (_page && _limit && _sort && _order) ?
                        `_page=${1}&_limit=${_limit}&_sort=${_sort}&_order=${_order}` :
                        '_page=1&_limit=15&_sort=selltime&_order=desc'
                ) +
                (tag ? `&tag=${tag}` : '') +
                (keyWord !== '' ? `&name=${keyWord}` : ''),
                undefined, { shallow: pathname === '/home/browsers' ? true : false }
            )
        }
    }

    return (
        <Row>
            <Col sm={4}>
                <Stack direction="horizontal" gap={3}>
                    <Link href={pathname === '/home/discover' ? asPath : '/home/discover'} passHref>
                        <span className={pathname === '/home/discover' ?
                            `${style.text} ${style.active}` :
                            `${style.text} ${style.inactive}`}>
                            Discover
                        </span>
                    </Link>
                    <Link href={pathname === '/home/browsers' ? asPath : '/home/browsers?_page=1&_limit=15&_sort=selltime&_order=desc'} passHref>
                        <span className={pathname === '/home/browsers' ?
                            `${style.text} ${style.active}` :
                            `${style.text} ${style.inactive}`}>
                            Browsers
                        </span>
                    </Link>
                    <Form.Control type="text"
                        size="lg"
                        className={style.searchForm}
                        placeholder="Search ..."
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onKeyPress={(e) => search(e)}
                    />
                </Stack>
            </Col>
        </Row>
    )
}