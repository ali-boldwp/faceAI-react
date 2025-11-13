import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser } from "../../feature/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("register");
    return () => {
      document.body.classList.remove("register");
    };
  }, []);


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!agree) {
    toast.error("Trebuie să fii de acord cu politica de confidențialitate și termenii.");
    return;
  }

  try {
    const result = await dispatch(registerUser({ name, email, password })).unwrap();

    toast.success("Bine ai venit! Contul tău a fost creat.");
    navigate("/"); 
  } catch (err: any) {
    toast.error(err?.message || "Înregistrarea a eșuat. Te rugăm să încerci din nou.");
  }
};


  return (
      <div className="dash-board-main-wrapper">
        <div className="main-center-content-m-left center-content">
          <div className="rts-register-area">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="single-form-s-wrapper">
                    <div className="head">
                      <span>Începe-ți călătoria</span>
                      <h5 className="title">Creează un cont</h5>
                    </div>
                    <div className="body">
                      <form onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                          <input
                              type="text"
                              placeholder="Nume complet"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                          />
                          <input
                              type="email"
                              placeholder="Email"
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

                        <div className="check-wrapper">
                          <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                                style={{"fontSize": "14px"}}
                            >
                              Sunt de acord cu politica de confidențialitate și termenii.
                            </label>
                          </div>
                        </div>

                        <button
                            type="submit"
                            className="rts-btn btn-primary"
                            disabled={loading}
                        >
                          {loading ? "Se creează..." : "Creează cont"}
                        </button>

                        <p>
                          Ai deja un cont? <Link to="/login">Autentificare</Link>
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

export default Register;
