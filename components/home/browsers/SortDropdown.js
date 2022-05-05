import { useRouter } from "next/router";
import { Dropdown } from "react-bootstrap"
import style from "../../../styles/SortDropdown.module.css";
import { fetchGames } from "../../../const/fetch";
import { queryBySort } from "../../../const/query";

export default function SortDropdown({ setGames, setPage }) {
    const router = useRouter()
    const { _page, _limit, _sort, _order, tag, name } = router.query;

    async function sortGames(sort, order) {
        var queryString = queryBySort(_page, _limit, _sort, _order, tag, name, sort, order)
        const data = await fetchGames(queryString)
        setGames(data);
        setPage();
        router.push(
            `/home/browsers?_page=${_page}&_limit=${_limit}&_sort=${sort}&_order=${order}` +
            (tag ? `&tag=${tag}` : '')+
            (name ? `&name=${name}` : ''),
            undefined, { shallow: true }
        )
    }

    function returnSort() {
        if (_sort === 'selltime') return 'Best selling'
        else if (_sort === 'price' && _order === 'asc') return 'Price: Low to High'
        else if (_sort === 'price' && _order === 'desc') return 'Price: High to Low'
        return ''
    }

    return (
        <Dropdown className={style.layout}>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" className={style.button}>
                <span style={{ color: "gray" }}>Sort by:</span> {returnSort()}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={() => sortGames("selltime", "desc")}>
                    Best selling
                </Dropdown.Item>
                <Dropdown.Item onClick={() => sortGames("price", "asc")}>
                    Price: Low to High
                </Dropdown.Item>
                <Dropdown.Item onClick={() => sortGames("price", "desc")}>
                    Price: High to Low
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}