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
  answers: { [key: string]: string };
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ sidebarItems, answers }) => {
  const location = useLocation();
  const themeSidebarToggle = useSelector(
    (state: RootState) => state.theme.themeSidebarToggle
  );

  const icons = [
    <GiLips />, <FaRegGrinBeam />, <GiNoseFront />, <FaEye />, <GiEyeball />,
    <GiHeadshot />, <GiAbstract002 />, <BsEmojiSmile />, <PiSmileyWinkBold />,
    <GiBodyHeight />, <GiHumanEar />, <FaUserCircle />
  ];

  return (
    <div className={`left-side-bar ${themeSidebarToggle ? "collapsed" : ""}`}>
      <div className="inner" style={{ height: "100%", overflow: "auto" }}>
        <div className="single-menu-wrapper">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to="#"
              className={`single-menu ${location.pathname === item.name ? "active" : ""}`}
            >
              <div className="icon" style={{ fontSize: "20px", color: "#001C42" }}>
                {icons[index]}
              </div>
              <p>
                {item.name}:{" "}
                <span style={{ color: "#007bff" }}>
                  {answers[item.name] || "____"}
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
