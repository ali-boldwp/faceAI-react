import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { THEME_MODE, THEME_SIDEBAR_TOGGLE, changeTheme, changeSidebarThemeToggle } from "Slices/theme/reducer";
import { RootState } from "Slices/theme/store";
import { logout } from "../feature/auth/authSlice";
import { useNavigate} from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";

import logo04 from "assets/images/logo/logo-04.png";
import avatar05 from "assets/images/avatar/05.png";
import user2 from "assets/images/avatar/user-2.svg";

const TopBar = () => {

    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();


    const toggleProfile = () => {
        setIsProfile(!isProfile);
    };

    const themeType = useSelector((state: RootState) => state.theme.themeType);
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };


    const toggleModeTheme = () => {
        const newTheme = themeType === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
        document.documentElement.setAttribute("data-theme", newTheme);
        dispatch(changeTheme(newTheme));
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", themeType);
    }, [themeType]);


    return (
        <>
            <div className="header-area-one" style={{padding:"10px"}}>
                <div className="container-30">
                    <Col lg={12}>
                        <div className="header-inner-one">
                            <div className="left-logo-area">
                                <Link to="/"  >
                                    <img src={logo04} alt="logo-image" style={{ width:"100px", }} />
                                </Link>
                            </div>
                            <div className="header-right">

                                <div className="action-interactive-area__header">

                                    
                                    <div className="single_action__haeader user_avatar__information openuptip">
                                        <div onClick={toggleProfile} >
                                            <FaRegUserCircle />
                                        </div>
                                        <div style={{ display: isProfile ? "block" : "none"  }} className="user_information_main_wrapper slide-down__click">
                                            <div className="user_header">
                                                <div className="main-avatar">
                                                    <img src={user2} alt="user" />
                                                </div>
                                                <div className="user_naim-information">
                                                    <h3 className="title">MR.Zaman Habib</h3>
                                                    <span className="desig"></span>
                                                </div>
                                            </div>

                                            <div className="popup-footer-btn">
                                                <button
                                                    onClick={handleLogout}
                                                    className="geex-content__header__popup__footer__link"
                                                    style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                                >
                                                    Deconectare <i className="fa-light fa-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>


        </>
    );
};

export default TopBar;