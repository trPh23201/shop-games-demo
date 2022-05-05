import { useState } from "react";
import { Button, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { postComment, resignToken, verifyToken } from "../../const/auth";
import { getCookie } from "../../const/cookie";

export default function PostReview({ game, setGame }) {
    const [text, setText] = useState('')
    const [like, setLike] = useState(null)
    const [spin, setSpin] = useState(false)

    function handlePost() {
        setSpin(true)
        const token = getCookie('token')
        const data = verifyToken(token)
        if (data) {
            if (data.name === '') {
                setTimeout(() => {
                    alert("You haven't tell us what is your name, please go to your profile and enter your name!")
                    setSpin(false)
                }, 1500)
            } else {
                const cmt = {
                    userId: data.id,
                    userName: data.name,
                    gameId: game.id,
                    gameName: game.name,
                    rate: like === 'yes' ? true : false,
                    comment: JSON.parse(JSON.stringify(text)),
                    created: (new Date()).toJSON()
                }
                const clone = { ...game }
                clone.reviews.unshift(cmt)
                setTimeout(() => {
                    setGame(clone)
                    setSpin(false)
                    postComment(cmt);
                    setText('')
                    setLike(null)
                }, 1500)
            }
        } else {
            resignToken()
            handlePost()
        }
    }

    function validate() {
        const token = getCookie('token')
        if (!token) {
            alert('Please login first!')
        } else {
            if (text.length === 0) alert('Please enter your comment!')
            else if (like === null) alert('Please rate for this game!')
            else handlePost()
        }
    }

    return (
        <Row>
            <Col sm={5}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        as="textarea"
                        placeholder="Write down your comment here!"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col sm={2}>
                <h5>Do you like this game?</h5>
                <Form.Check
                    inline
                    label="Yes"
                    name="group1"
                    type="radio"
                    id="inline-radio-1"
                    defaultChecked={like === 'yes' ? true : false}
                    onClick={() => setLike('yes')}
                />
                <Form.Check
                    inline
                    label="No"
                    name="group1"
                    type="radio"
                    id="inline-radio-2`"
                    defaultChecked={like === 'no' ? true : false}
                    onClick={() => setLike('no')}
                />
            </Col>
            <Col sm={2}>
                <Stack gap={2} className="col-md-12">
                    {spin ?
                        <Button variant="success" disabled>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {' '}Posting...
                        </Button> :
                        <Button variant="success" onClick={() => validate()} >Post</Button>
                    }
                    <Button variant="secondary" onClick={() => setText('')}>Clear</Button>
                </Stack>
            </Col>
        </Row>
    )
}