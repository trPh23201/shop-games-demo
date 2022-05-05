import { Col, Row, Toast } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs"
import style from "../../styles/Reviews.module.css"
import Link from "next/link";

export default function Reviews({ game }) {

    function renderAgo(jsonDate) {
        const past = new Date(jsonDate).getTime();
        const now = new Date().getTime();
        const seccond = 1000;
        const minute = seccond * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const seccondAgo = Math.floor((now - past) / seccond);
        const minuteAgo = Math.floor((now - past) / minute);
        const hourAgo = Math.floor((now - past) / hour);
        const dayAgo = Math.floor((now - past) / day);
        const weekAgo = Math.floor((now - past) / week);

        if (seccondAgo < 10) return `Just now`
        else if (seccondAgo < 60) return `${seccondAgo} secconds ago`
        else if (minuteAgo < 60) return `${minuteAgo} minute${minuteAgo > 1 ? 's' : ''} ago`
        else if (hourAgo < 24) return `${hourAgo} hour${hourAgo > 1 ? 's' : ''} ago`
        else if (dayAgo < 7) return `${dayAgo} day${dayAgo > 1 ? 's' : ''} ago`
        else return `${weekAgo} week${weekAgo > 1 ? 's' : ''} ago`
    }

    function renderReviews() {
        return game?.reviews.map((el, key) => {
            let comment = el.comment.split('\n').map((str, key) => <span key={key}>{str}<br /></span>)
            return (
                <Col sm={4} key={key}>
                    <Toast className={style.toast} >
                        <Toast.Header className={style.header} closeButton={false}>
                            <Link href={`/profile?id=${el.userId}`} passHref>
                                <strong className="me-auto">
                                    <BsPersonCircle className={style.icon} /> {el.userName}
                                </strong>
                            </Link>
                            <small className="text-muted">{renderAgo(el.created)}</small>
                        </Toast.Header>
                        <Toast.Body className={style.body}>
                            <h4 className={el.rate ? style.rate : style.non_rate}>
                                {el.rate ? 'Recommend' : 'Not Recommend'}
                            </h4>
                            <span>{comment}</span>
                        </Toast.Body>
                    </Toast>
                </Col >
            )
        })
    }

    return (
        <Row>
            {renderReviews()}
            {game?.reviews.length === 0 && <h1 style={{ textAlign: 'center', color: 'gray' }} >No comments yet be the first one!</h1>}
        </Row>
    )
}