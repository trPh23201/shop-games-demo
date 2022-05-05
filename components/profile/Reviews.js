import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { removeComment, resignToken, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";
import { fetchReviews } from "../../const/fetch";
import style from "../../styles/ReviewsProfile.module.css"

export default function Reviews({ token, setToken, viewUser }) {
    const [show, setShow] = useState(false);
    const [reviews, setReviews] = useState(null);
    const [review, setReview] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const data = verifyToken(token)
        if (data) {
            async function getReviews(id) {
                const rev = await fetchReviews(viewUser ? viewUser.id : id)
                setReviews(rev)
            }
            getReviews(data.id)
        } else {
            resignToken()
            setToken(getCookie("token"))
        }
    }, [token, setToken, viewUser])

    function handleView(item) {
        setReview(item)
        handleShow()
    }

    function findIndex(state, id) {
        var temp = -1;
        state.forEach((st, index) => {
            if (st.id === id) temp = index;
        })
        return temp
    }

    function handleDelete(id) {
        const index = findIndex(reviews, id)
        var arr = [...reviews]
        arr.splice(index, 1)
        setReviews(arr)
        removeComment(id)
    }

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

    function renderComment(text) {
        if (text.length > 20) return text.slice(0, 20) + "..."
        else return text
    }

    function renderGameName(text) {
        if (text.length > 12) return text.slice(0, 12) + "..."
        else return text
    }

    function renderCommentModal(text) {
        return text?.split('\n').map((str, key) => <span key={key}>{str}<br /></span>)
    }

    function renderReviews() {
        return reviews?.map((el, key) => (
            <tr key={key}>
                <td>{key + 1}</td>
                <td>{renderGameName(el.gameName)}</td>
                <td>{renderComment(el.comment)}</td>
                <td className={el.rate ? style.rate : style.non_rate} >{el.rate ? 'YES' : 'NO'}</td>
                <td>{renderAgo(el.created)}</td>
                <td>
                    <Button size="sm" variant="success" onClick={() => handleView(el)} className={style.button}>View</Button> {' '}
                    <Button size="sm" variant="danger" disabled={viewUser ? true : false} onClick={() => handleDelete(el.id)} className={style.button}>Delete</Button>
                </td>
            </tr>
        ))
    }

    return (
        <>
            {viewUser?.hide.reviews ?
                <h2 style={{ color: 'gray', textAlign: 'center' }}>User&apos;s reviews can&apos;t be found</h2> :
                <>
                    <Table responsive striped bordered hover variant="dark" className={style.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Game</th>
                                <th>Comment</th>
                                <th>Rate</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews?.length === 0 && !viewUser?.hide.reviews ? <h2 style={{ color: 'gray', textAlign: 'center' }}>No game in your reviews</h2> : ''}
                            {renderReviews()}
                        </tbody>
                    </Table>

                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header className={style.modal}>
                            <Modal.Title><h5>{review?.gameName}:</h5> <h6 style={{ color: 'gray' }}>{renderAgo(review?.created)}</h6> </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={style.modal}>
                            <h4 className={review?.rate ? style.rate : style.non_rate}>
                                {review?.rate ? "Recomended" : "Not reacommend"}
                            </h4>
                            {renderCommentModal(review?.comment)}
                        </Modal.Body>
                        <Modal.Footer className={style.modal}>
                            <Button variant="warning" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal></>
            }
        </>
    )
}