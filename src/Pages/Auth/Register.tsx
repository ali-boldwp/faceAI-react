import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

const Register = () => {

    useEffect(() => {
        document.body.classList.add("register");

        return () => {
            document.body.classList.remove("register");
        };
    }, []);
    
    return (
        <>
            <div className="dash-board-main-wrapper">
                <div className="main-center-content-m-left center-content">
                    <div className="rts-register-area">
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <div className="single-form-s-wrapper">
                                        <div className="head">
                                            <span>Start your Journey</span>
                                            <h5 className="title">Create an account</h5>
                                        </div>
                                        <div className="body">
                                            <form action="#">
                                                <div className="input-wrapper">
                                                    <input type="text" placeholder="Full Name" required />
                                                    <input type="email" placeholder="Enter your mail" />
                                                    <input type="password" placeholder="Enter your Password" />
                                                </div>
                                                <div className="check-wrapper">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                            I agree to privacy policy &amp; terms
                                                        </label>
                                                    </div>
                                                </div>
                                                <button className="rts-btn btn-primary">Create Account</button>
                                                <p>If you have an account? <a className="ml--5" href="login.html">Sign in</a></p>
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

export default Register;