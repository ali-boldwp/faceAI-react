import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GiNoseFront,
  GiEyeball,
  GiHeadshot,
  GiAbstract002,
  GiLips,
  GiHumanEar,
  GiBodyHeight,
} from "react-icons/gi";
import { FaRegGrinBeam, FaEye, FaUserCircle } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { PiSmileyWinkBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "Slices/theme/store";

interface SidebarItem {
  name: string;
}
interface LeftSidebarProps {
  sidebarItems: SidebarItem[];
  answers: { [key: string]: string | string[] };
}

const nameTranslations: { [key: string]: string } = {
  "Face Shape": "Forma feței",
  "Forehead": "Fruntea",
  "Eyebrows": "Sprâncenele",
  "Eyes": "Ochii",
  "Nose": "Nasul",
  "Cheeks and Cheekbones": "Obrajii și pomeții",
  "Mouth and Lips": "Gura și buzele",
  "Chin and Jawline": "Bărbia și linia maxilarului",
  "Ear (Urechile)": "Urechea",
  "Neck and Throat": "Gâtul și zona gâtului",
  "Skin Texture and Facial Wrinkles": "Textura pielii și ridurile feței",
};


const LeftSidebar: React.FC<LeftSidebarProps> = ({ sidebarItems, answers }) => {
  const location = useLocation();
  const themeSidebarToggle = useSelector(
    (state: RootState) => state.theme.themeSidebarToggle
  );
 const themeType = useSelector((state: RootState) => state.theme.themeType);
const icons = [
  <GiHeadshot />,          
  <GiAbstract002 />,        
  <FaRegGrinBeam />,         
  <FaEye />,                
  <GiNoseFront />,   
  <GiEyeball />,           
  <GiLips />,                
  <PiSmileyWinkBold />,      
  <GiHumanEar />,           
  <GiBodyHeight />,         
  <FaUserCircle />,          
];
const getIconColor = () => (themeType === "dark" ? "#c5c5c5" : "#001C42");
  return (
    <div className={`left-side-bar ${themeSidebarToggle ? "collapsed" : ""}`} style={{borderLeft:"1px solid #E5E4FF"}}>
      <div className="inner" style={{ height: "100%", overflow: "auto" }}>
        <div className="single-menu-wrapper">
         {sidebarItems.map((item, index) => (
  <Link
    key={index}
    to="#"
    className={`single-menu ${location.pathname === item.name ? "active" : ""}`}
  >
    <div className="icon" style={{ fontSize: "20px", color: getIconColor() }}>
      {icons[index]}
    </div>
    <p style={{ color: getIconColor() }}>
      {nameTranslations[item.name] || item.name}:{" "}
      <span style={{ color: getIconColor() }}>
        {Array.isArray(answers[item.name])
          ? (answers[item.name] as string[]).join(", ")
          : (answers[item.name] as string) || "____"}
      </span>
    </p>
  </Link>
))}

        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
