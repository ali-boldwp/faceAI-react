import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSmile,
  FaRegGrinBeam,
  FaEye,
  FaUserCircle,
} from "react-icons/fa";
import {
  GiNoseFront,
  GiEyeball,
  GiHeadshot,
  GiAbstract002,
  GiLips,
  GiHumanEar,
  GiBodyHeight,
} from "react-icons/gi";
import { BsEmojiSmile } from "react-icons/bs";
import { PiSmileyWinkBold } from "react-icons/pi";
import avatar02 from "assets/images/avatar/02.png";
import icons14 from "assets/images/icons/14.png";
import { useSelector } from "react-redux";
import { RootState } from "Slices/theme/store";

const LeftSidebar = () => {
  const location = useLocation();
  const themeSidebarToggle = useSelector(
    (state: RootState) => state.theme.themeSidebarToggle
  );

  const sidebarItems = [
    { name: "Mouth and Lips", icon: <GiLips />, path: "/mouth-lips" },
    { name: "Cheeks and Cheekbones", icon: <FaRegGrinBeam />, path: "/cheeks" },
    { name: "Nose", icon: <GiNoseFront />, path: "/nose" },
    { name: "Eyes", icon: <FaEye />, path: "/eyes" },
    { name: "Eyebrows", icon: <GiEyeball />, path: "/eyebrows" },
    { name: "Forehead", icon: <GiHeadshot />, path: "/forehead" },
    { name: "Face Shape", icon: <GiAbstract002 />, path: "/face-shape" },
    { name: "Round Face", icon: <BsEmojiSmile />, path: "/round-face" },
    {
      name: "Skin Texture and Facial Wrinkles",
      icon: <PiSmileyWinkBold />,
      path: "/skin-texture",
    },
    { name: "Neck and Throat", icon: <GiBodyHeight />, path: "/neck-throat" },
    { name: "Ears (Urechile)", icon: <GiHumanEar />, path: "/ears" },
    { name: "Chin and Jawline", icon: <FaUserCircle />, path: "/chin-jawline" },
  ];

  return (
    <div className={`left-side-bar ${themeSidebarToggle ? "collapsed" : ""}`}>
      <div className="overlay-mobile-area"></div>

      <div className="inner" style={{height:"100%" , overflow:"auto"}}>
        <div className="single-menu-wrapper">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`single-menu openuptip ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <div className="icon" style={{ fontSize: "20px", color: "#001C42" }}>
                {item.icon}
              </div>
              <p>{item.name} : ____</p>
              
            </Link>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default LeftSidebar;
