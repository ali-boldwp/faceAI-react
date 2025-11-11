import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../feature/auth/authSlice";
import toast from "react-hot-toast";

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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promise = dispatch(loginUser({ email, password })).unwrap();

    toast.promise(promise, {
      loading: "Logging you in...",
      success: "Welcome back!",
      error: "Invalid credentials, please try again.",
    });

    try {
      await promise; // wait for login to succeed
      navigate("/"); // only navigate on success
    } catch (err) {
      // login failed, stay on page
      console.error("Login failed:", err);
    }
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
                    <span>Bine ai revenit</span>
                    <h5 className="title">Autentifică-te pentru a continua</h5>
                  </div>
                  <div className="body">
                    <form onSubmit={handleSubmit}>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          placeholder="hello"
                          // placeholder="Introdu adresa ta de e-mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Parolă"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {/* <div className="check-wrapper">
                        <Link
                          style={{ textAlign: "right", width: "100%" }}
                          to="/reset"
                        >
                          Forgot password?
                        </Link>
                      </div> */}

                      {error && <p style={{ color: "red" }}>{error}</p>}

                      <button
                        type="submit"
                        className="rts-btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Se autentifică..." : "Autentificare"}
                      </button>

                      <p>
                        Nu ai un cont?{" "}
                        <Link className="ml--5" to="/register">
                          Înscrie-te gratuit
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
