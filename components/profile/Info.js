import { Form, Stack, InputGroup, Col, FormControl, Row, Button } from "react-bootstrap";
import { BsBrushFill, BsSave, BsXLg } from "react-icons/bs";
import { resignToken, updateProfile, verifyToken } from "../../const/auth.js";
import { getCookie } from "../../const/cookie";
import { useState, useEffect } from "react";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { rsaDecrypt } from "../../const/rsa.js";

export default function Info({ token, setToken, viewUser }) {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [birthday, setBirthday] = useState('')
    const [disabledName, setDName] = useState(true)
    const [disabledPhone, setDPhone] = useState(true)
    const [disabledGender, setDGender] = useState(true)
    const [disabledBirthday, setDBirthday] = useState(true)

    function hideEmail(text) {
        let arr = text.split('@')
        let hide = arr[0].slice(1, arr[0].length - 1);
        let rs = '';
        for (var i = 0; i < hide.length; i++) {
            rs += '*'
        }
        rs = text.slice(0, 1) + rs + arr[0].slice(arr[0].length - 1, arr[0].length) + '@' + arr[1]
        if (!viewUser) return text;
        else return rs
    }

    useEffect(() => {
        const data = verifyToken(token)
        if (data) {
            setUser(viewUser ? viewUser : data)
            setName(viewUser ? viewUser.name : data.name)
            setPhone(viewUser ? (viewUser.hide.phone ? '**********' : viewUser.phone) : (data.hide.phone ? rsaDecrypt(data.phone) : data.phone))
            setGender(viewUser ? viewUser.gender : data.gender)
            setBirthday(viewUser ? (viewUser.hide.birthday ? '**********' : viewUser.birthday) : (data.hide.birthday ? rsaDecrypt(data.birthday) : data.birthday))
        } else {
            resignToken()
            setToken(getCookie("token"))
        }
    }, [token, setToken, viewUser])

    function renderDate(jsonDate) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(jsonDate)
        let month = months[d.getMonth()];
        return `${d.getDate()} ${month}, ${d.getFullYear()}`
    }

    function handleCancel(name) {
        if (name === 'name') {
            setName(user.name)
            setDName(true)
        } else if (name === 'phone') {
            setPhone(user.phone)
            setDPhone(true)
        } else if (name === 'gender') {
            setGender(user.gender)
            setDGender(true)
        } else if (name === 'birthday') {
            setBirthday(user.birthday)
            setDBirthday(true)
        }
    }

    function handleSave(type) {
        if (type === 'name') {
            updateProfile(user.id, name, 'name')
            setDName(true)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        } else if (type === 'phone') {
            updateProfile(user.id, phone, 'phone')
            setDPhone(true)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
        else if (type === 'gender') {
            updateProfile(user.id, gender, 'gender')
            setDGender(true)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        } else if (type === 'birthday') {
            updateProfile(user.id, birthday, 'birthday')
            setDBirthday(true)
            setTimeout(() => { setToken(getCookie("token")) }, 5000)
        }
    }

    return (
        <Stack >
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                        <FormControl disabled type="email" placeholder="Email" value={user ? hideEmail(user.email) : ''} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Name
                    </Form.Label>
                    <Col sm={10}>
                        <InputGroup>
                            <FormControl
                                placeholder="Please enter your name"
                                value={name}
                                disabled={disabledName}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {disabledName ?
                                viewUser ? '' : <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setDName(false)} ><BsBrushFill /></InputGroup.Text> :
                                <>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleSave('name')}><BsSave /></InputGroup.Text>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleCancel('name')}  ><BsXLg /></InputGroup.Text>
                                </>
                            }
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Phone
                    </Form.Label>
                    <Col sm={10}>
                        <InputGroup>
                            <FormControl
                                placeholder="Please enter your phone"
                                value={phone}
                                disabled={disabledPhone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {disabledPhone ?
                                viewUser ? '' : <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setDPhone(false)} ><BsBrushFill /></InputGroup.Text> :
                                <>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleSave('phone')}><BsSave /></InputGroup.Text>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleCancel('phone')}  ><BsXLg /></InputGroup.Text>
                                </>
                            }
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Gender
                    </Form.Label>
                    <Col sm={10}>
                        {disabledGender ?
                            <>
                                <Form.Label column sm={10}>
                                    {gender === '' ? 'Unknown' : gender} &nbsp;
                                    {viewUser ? '' : <BsBoxArrowUpRight onClick={() => setDGender(false)} style={{ cursor: 'pointer', fontSize: '20px' }} />}
                                </Form.Label>
                            </> :
                            <>
                                <Form.Check
                                    type="radio"
                                    label="Male"
                                    name="gg"
                                    id="formHorizontalRadios1"
                                    onClick={() => setGender('Male')}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Female"
                                    name="gg"
                                    id="formHorizontalRadios2"
                                    onClick={() => setGender('Female')}
                                />
                                <Button size="sm" variant="success" onClick={() => handleSave('gender')} >Save</Button>&emsp;
                                <Button size="sm" variant="danger" onClick={() => handleCancel('gender')}>Cancel</Button>
                            </>}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Birthday
                    </Form.Label>
                    <Col sm={10}>
                        <InputGroup>
                            <FormControl
                                placeholder="Please enter your birthday"
                                value={birthday}
                                disabled={disabledBirthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                            {disabledBirthday ?
                                viewUser ? '' : <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setDBirthday(false)} ><BsBrushFill /></InputGroup.Text> :
                                <>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleSave('birthday')}><BsSave /></InputGroup.Text>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => handleCancel('birthday')}  ><BsXLg /></InputGroup.Text>
                                </>
                            }
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        Created
                    </Form.Label>
                    <Col sm={10}>
                        <FormControl disabled type="text" placeholder="date" value={user ? renderDate(user.created) : ''} />
                    </Col>
                </Form.Group>
            </Form>
        </Stack>
    )
}