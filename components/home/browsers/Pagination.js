import { Pagination as Pagi } from "react-bootstrap";
import style from './../../../styles/Pagination.module.css';
import { useRouter } from "next/router";
import { fetchGames } from "../../../const/fetch";
import { queryByScrollPagi } from "../../../const/query";

export default function Pagination({ count, setGames }) {
    const router = useRouter()
    const { _page, _limit, _sort, _order, tag, name } = router.query;
    const totalPage = Math.ceil(count / _limit);

    async function paginate(page) {
        var queryString = queryByScrollPagi(_page, _limit, _sort, _order, tag, name, page)
        const data = await fetchGames(queryString)
        setGames(data)
        router.push(
            `/home/browsers?_page=${page}&_limit=${_limit}&_sort=${_sort}&_order=${_order}`+
            (tag ? `&tag=${tag}` : '')+
            (name ? `&name=${name}` : ''),
            undefined, { scroll: true, shallow: true })
    }

    function render() {
        var pagi = []
        for (let i = 1; i <= totalPage; i++) {
            i == _page ?
                pagi.push(<Pagi.Item active key={i}>{i}</Pagi.Item>) :
                pagi.push(<Pagi.Item key={i} onClick={() => paginate(i)}>{i}</Pagi.Item>)
        }
        return (pagi)
    }

    return (
        <Pagi className={style.pagination}>
            {_page == 1 || <Pagi.First onClick={() => paginate(1)}/>}
            {_page == 1 || <Pagi.Prev onClick={() => paginate(_page*1 - 1)}/>}
            {totalPage == 1 || render()}
            {_page == totalPage || <Pagi.Next onClick={() => paginate(_page*1 + 1)}/>}
            {_page == totalPage || <Pagi.Last onClick={() => paginate(totalPage)}/>}
        </Pagi>
    )
}