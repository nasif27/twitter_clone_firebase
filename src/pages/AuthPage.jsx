import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";

export default function AuthPage({apiURL}) {
    const loginImage = "https://sig1.co/img-twitter-1";
    // const url = 'https://73b2e477-a28f-4970-8116-232a588b3002-00-3gw52rtdl66kv.pike.replit.dev';
    
    // Possible values: null (no modal shows), "Login", "SignUp"
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow('SignUp');
    const handleShowLogin = () => setModalShow('Login');

    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useLocalStorage('authToken', '');

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            navigate('/profile');
        }
    }, [authToken, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiURL}/signup`, {username, password});
            console.log(res.data); 
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiURL}/login`, {username, password});
            // console.log(res.data);
            if (res.data && res.data.auth === true && res.data.token) {     // if data is present && if auth = true && if token is present
                setAuthToken(res.data.token); // save token to local storage
                console.log('Login was successful, token saved');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => setModalShow(null);

    return (
        <Row>
            <Col sm={6}>
                <Image src={loginImage} fluid />
            </Col>
            <Col sm={6} className="p-4">
                <i className="bi bi-twitter" style={{fontSize: 50, color: "dodgerblue"}}></i>

                <p className="mt-5" style={{fontSize: 64}}>Happening Now</p>
                <h2 className="my-5" style={{fontSize: 31}}>Join Twitter Today.</h2>

                <Col sm={5} className="d-grid gap-2">
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>

                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-apple"></i> Sign up with Apple
                    </Button>

                    <p style={{textAlign: "center"}}>or</p>
                    <Button className="rounded-pill" onClick={handleShowSignUp}>
                        Create an account
                    </Button>
                    <p style={{fontSize: "12px"}}>
                        By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use
                    </p>

                    <p className="mt-5" style={{fontWeight: "bold"}}>
                        Already have an account?
                    </p>
                    <Button 
                        className="rounded-pill" 
                        variant="outline-primary"
                        onClick={handleShowLogin}
                    >
                        Sign In
                    </Button>
                </Col>

                <Modal 
                    show={modalShow !== null}   // this means that info in modal cannot be empty, if it left empty, API will not return error & DB will accept it as empty string 
                    onHide={handleClose}
                    animation={false} 
                    centered
                >
                    <Modal.Body>
                        <h2 className="mb-4" style={{fontWeight: "bold"}}>
                            {modalShow === "SignUp" ? "Create your account" : "Log in to your account"}
                        </h2>

                        <Form 
                            className="d-grid gap-2 px-5" 
                            onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
                        >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter password"
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required
                                />
                            </Form.Group>

                            <p style={{fontSize: "12px"}}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, aliquam.
                            </p>

                            <Button className="rounded-pill" type="submit">
                                {modalShow === "SignUp" ? "Sign up" : "Log in"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    );
}