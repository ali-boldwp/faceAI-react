import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../feature/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("register", "page-login");
    return () => {
      document.body.classList.remove("register", "page-login");
    };
  }, []);

  // Redirect to dashboard after login
  useEffect(() => {
    if (user) {
      navigate("/"); 
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
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
                    <form onSubmit={handleSubmit}>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          placeholder="Enter your mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="check-wrapper">
                        <Link
                          style={{ textAlign: "right", width: "100%" }}
                          to="/reset"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {error && <p style={{ color: "red" }}>{error}</p>}

                      <button
                        type="submit"
                        className="rts-btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Log In"}
                      </button>

                      <p>
                        Don't have an account?{" "}
                        <Link className="ml--5" to="/register">
                          Sign Up for Free
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Login;
