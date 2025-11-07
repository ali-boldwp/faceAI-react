import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { THEME_MODE, THEME_SIDEBAR_TOGGLE, changeTheme, changeSidebarThemeToggle } from "Slices/theme/reducer";
import { RootState } from "Slices/theme/store";
import { logout } from "../feature/auth/authSlice";
import { useNavigate} from "react-router-dom";

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
            <div className="header-area-one">
                <div className="container-30">
                    <Col lg={12}>
                        <div className="header-inner-one">
                            <div className="left-logo-area">
                                <Link to="/"  >
                                    <img src={logo04} alt="logo-image" style={{maxWidth:"18%" , marginTop:"10px"}} />
                                </Link>
                            </div>
                            <div className="header-right">

                                <div className="action-interactive-area__header">

                                    <div className="single_action__haeader rts-dark-light openuptip" id="rts-data-toggle">
                                        <div onClick={toggleModeTheme} style={{ cursor: 'pointer' }}>
                                            {themeType === 'light' ? (
                                                <div className="in-light">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.625 1.25H9.375V4.375H10.625V1.25ZM15.7452 3.37099L13.5541 5.56213L14.4379 6.44593L16.629 4.25478L15.7452 3.37099ZM15.625 9.375H18.75V10.625H15.625V9.375ZM14.4379 13.5541L13.5541 14.4379L15.7452 16.629L16.629 15.7452L14.4379 13.5541ZM9.375 15.625H10.625V18.75H9.375V15.625ZM5.56212 13.5541L3.37097 15.7452L4.25477 16.629L6.44591 14.4379L5.56212 13.5541ZM1.25 9.375H4.375V10.625H1.25V9.375ZM4.25479 3.37097L3.37099 4.25476L5.56214 6.44591L6.44593 5.56211L4.25479 3.37097ZM11.3889 7.92133C10.9778 7.64662 10.4945 7.5 10 7.5C9.33719 7.50074 8.70174 7.76438 8.23306 8.23306C7.76438 8.70174 7.50075 9.33719 7.5 10C7.5 10.4945 7.64662 10.9778 7.92133 11.3889C8.19603 11.8 8.58648 12.1205 9.04329 12.3097C9.50011 12.4989 10.0028 12.5484 10.4877 12.452C10.9727 12.3555 11.4181 12.1174 11.7678 11.7678C12.1174 11.4181 12.3555 10.9727 12.452 10.4877C12.5484 10.0028 12.4989 9.50011 12.3097 9.04329C12.1205 8.58648 11.8 8.19603 11.3889 7.92133ZM7.91661 6.88199C8.5333 6.46993 9.25832 6.25 10 6.25C10.9946 6.25 11.9484 6.64509 12.6517 7.34835C13.3549 8.05161 13.75 9.00544 13.75 10C13.75 10.7417 13.5301 11.4667 13.118 12.0834C12.706 12.7001 12.1203 13.1807 11.4351 13.4645C10.7498 13.7484 9.99584 13.8226 9.26841 13.6779C8.54098 13.5333 7.8728 13.1761 7.34835 12.6517C6.8239 12.1272 6.46675 11.459 6.32206 10.7316C6.17736 10.0042 6.25163 9.25016 6.53545 8.56494C6.81928 7.87971 7.29993 7.29404 7.91661 6.88199Z" fill="#08395D" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="in-dark">
                                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.43606 9.58151C3.65752 9.87564 4.92547 9.92252 6.16531 9.71938C7.40516 9.51625 8.59186 9.0672 9.65559 8.39867C10.7193 7.73013 11.6386 6.85561 12.3594 5.82654C13.0802 4.79747 13.5878 3.63465 13.8526 2.40648C14.5174 3.05723 15.0448 3.83492 15.4033 4.69337C15.7619 5.55183 15.9443 6.47357 15.9398 7.40388C15.9393 7.49044 15.9419 7.57777 15.9382 7.665C15.8708 9.2842 15.2384 10.8287 14.1508 12.0301C13.0632 13.2316 11.5892 14.0141 9.98463 14.2419C8.38012 14.4696 6.74651 14.1282 5.36754 13.2768C3.98858 12.4255 2.95137 11.118 2.43606 9.58151V9.58151ZM0.933336 8.6487C0.933165 8.68529 0.9362 8.72182 0.942407 8.75788C1.28351 10.7502 2.34974 12.5458 3.93575 13.7989C5.52175 15.052 7.51534 15.6739 9.53252 15.5449C11.5497 15.4158 13.4478 14.545 14.8612 13.1C16.2746 11.655 17.1033 9.73813 17.1878 7.71859C17.1921 7.61606 17.189 7.51347 17.1897 7.41179C17.1985 6.10006 16.8914 4.80548 16.2943 3.6375C15.6972 2.46953 14.8276 1.4625 13.7591 0.701557C13.667 0.639835 13.5603 0.603476 13.4496 0.59614C13.339 0.588804 13.2284 0.610752 13.129 0.659772C13.0295 0.708793 12.9447 0.783154 12.8832 0.875366C12.8216 0.967579 12.7855 1.07438 12.7783 1.18503C12.661 2.43295 12.2583 3.63719 11.6014 4.70467C10.9444 5.77214 10.0508 6.67425 8.98959 7.34127C7.92838 8.00829 6.728 8.42235 5.48124 8.55146C4.23448 8.68056 2.97473 8.52125 1.79936 8.08583C1.70533 8.04882 1.60382 8.03482 1.50329 8.04497C1.40276 8.05511 1.30522 8.08909 1.21997 8.14437C1.13473 8.19965 1.0642 8.27463 1.01418 8.36272C0.964152 8.45082 0.936972 8.54983 0.933336 8.65037V8.6487Z" fill="#F3F3F3" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                    <div className="single_action__haeader user_avatar__information openuptip">
                                        <div onClick={toggleProfile} className="avatar">
                                            <img src={avatar05} alt="avatar" />
                                        </div>
                                        <div style={{ display: isProfile ? "block" : "none" }} className="user_information_main_wrapper slide-down__click">
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
                                                    Logout <i className="fa-light fa-arrow-right"></i>
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