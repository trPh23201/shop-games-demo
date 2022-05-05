import { useRouter } from "next/router";
import { useState } from "react";
import { ListGroup, Badge, Form } from "react-bootstrap";
import { BsCheckLg } from 'react-icons/bs';
import style from "../../../styles/TagList.module.css";
import { fetchGames } from "../../../const/fetch";
import { queryByTag } from "../../../const/query";

export default function TagList({ tags, setGames, setCountByTag, setPage }) {
    const router = useRouter();
    const { _page, _limit, _sort, _order, tag: queryTag, name: queryName } = router.query;
    const [searchKey, setSearchKey] = useState('') //SearchKey

    async function filterGames(name, count) {
        var queryString = queryByTag(_page, _limit, _sort, _order, queryName, name)
        const data = await fetchGames(queryString)
        setGames(data);
        setCountByTag(count);
        setPage();
        router.push(
            `/home/browsers?_page=${1}&_limit=${_limit}&_sort=${_sort}&_order=${_order}` +
            (name === '' ? '' : `&tag=${name}`)+
            (queryName ? `&name=${queryName}` : ''),
            undefined, { shallow: true }
        )
    }

    function renderTags() {
        return tags?.map(tag => (
            tag.name.toUpperCase().indexOf(searchKey.toUpperCase()) > -1 &&
            <ListGroup.Item action key={tag.id}
                onClick={tag.name === queryTag ? () => filterGames('', -1) : () => filterGames(tag.name, tag.countGames)}
                className={tag.name === queryTag ? `${style.item} ${style.item_checked}` : style.item}
            >
                <span>{tag.name}</span>&ensp;
                <Badge bg="warning" text="dark">{tag.countGames}</Badge>
                {tag.name === queryTag && <BsCheckLg className={style.icon} />}
            </ListGroup.Item>
        ))
    }

    return (
        <ListGroup className={style.tag_list}>
            <Form.Control type="text"
                className={style.searchForm}
                placeholder="Filter keyword ..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)} />
            {renderTags()}
        </ListGroup>
    )
}