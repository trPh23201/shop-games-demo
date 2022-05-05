import { BsPersonLinesFill, BsFolder2, BsFillChatLeftTextFill, BsBookmarkStar } from 'react-icons/bs';
import { ListGroup } from 'react-bootstrap';
import style from '../../styles/DashBoard.module.css'

export default function DashBoard({ handleClick, info, purc, revi, wish, sett, viewUser }) {
    return (
        <ListGroup className={style.dash_board}>
            <ListGroup.Item action
                className={info ? `${style.item} ${style.item_selected}` : style.item}
                onClick={() => handleClick('info')}>
                <BsPersonLinesFill style={{ verticalAlign: "baseline" }} /> <span>Information</span>
            </ListGroup.Item >
            <ListGroup.Item action
                className={purc ? `${style.item} ${style.item_selected}` : style.item}
                onClick={() => handleClick('purc')}>
                <BsFolder2 style={{ verticalAlign: "baseline" }} /> <span>Purchased</span>
            </ListGroup.Item>
            <ListGroup.Item action
                className={revi ? `${style.item} ${style.item_selected}` : style.item}
                onClick={() => handleClick('revi')}>
                <BsFillChatLeftTextFill style={{ verticalAlign: "baseline" }} /> <span>Reviews</span>
            </ListGroup.Item>
            <ListGroup.Item action
                className={wish ? `${style.item} ${style.item_selected}` : style.item}
                onClick={() => handleClick('wish')}>
                <BsBookmarkStar style={{ verticalAlign: "baseline" }} /> <span>Wishlist</span>
            </ListGroup.Item>
            {viewUser ? '' :
                <ListGroup.Item action
                    className={sett ? `${style.item} ${style.item_selected}` : style.item}
                    onClick={() => handleClick('sett')}>
                    <BsFolder2 style={{ verticalAlign: "baseline" }} /> <span>Settings</span>
                </ListGroup.Item>}
        </ListGroup>
    )
}