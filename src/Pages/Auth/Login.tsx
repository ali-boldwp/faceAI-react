import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {

    useEffect(() => {
        document.body.classList.add("register", "page-login");

        return () => {
            document.body.classList.remove("register", "page-login");
        };
    }, []);

    return (
        <>
            <div className="dash-board-main-wrapper pt--40">
                <div className="main-center-content-m-left center-content">
                    <div className="rts-register-area">
                        <Container>
                            <Row>
                                <Col lg={12}>

                                    <div className="single-form-s-wrapper">
                                        <div className="head">
                                            <span>Welcome Back</span>
                                            <h5 className="title">Login to continue</h5>
                                        </div>
                                        <div className="body">
                                            <form action="#" method="post">
                                                <div className="input-wrapper">
                                                    <input type="email" placeholder="Enter your mail" required />
                                                    <input type="password" placeholder="Password" />
                                                </div>
                                                <div className="check-wrapper" >
                                                    <Link style={{textAlign: "right" , width : "100%"}} to="/reset">Forgot password?</Link>
                                                </div>
                                                <button type="submit" className="rts-btn btn-primary">Log In</button>
                                                <p>Don't have an account? <Link className="ml--5" to="/register">Sign Up for Free</Link></p>
                                            </form>
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;