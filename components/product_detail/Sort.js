import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import style from "../../styles/SortDropdown.module.css"

export default function Sort({ game, setGame }) {
    const [sort, setSort] = useState('Recent')

    function handleSort(text) {
        if (text === 'Old') {
            const clone = { ...game };
            clone.reviews.sort((a, b) => {
                const count1 = new Date(a.created).getTime();
                const count2 = new Date(b.created).getTime();
                return count1 - count2
            })
            setGame(clone)
            setSort(text)
        } else {
            const clone = { ...game };
            clone.reviews.sort((a, b) => {
                const count1 = new Date(a.created).getTime();
                const count2 = new Date(b.created).getTime();
                return count2 - count1
            })
            setGame(clone)
            setSort(text)
        }
    }

    return (
        <Dropdown className={style.dropdown}>
            <Dropdown.Toggle variant="dark" id="dropdown" className={style.dropdown_button}>
                <span style={{ color: 'gray' }}>Sort by: </span>{sort}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={() => handleSort('Recent')}>
                    Recent
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort('Old')}>
                    Old
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}