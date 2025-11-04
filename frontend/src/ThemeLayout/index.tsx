import React, { ReactNode } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "Pages/Home/RightSidebar";

interface ThemeLayoutProps {
    children: ReactNode;
}
const ThemeLayout = ({ children }: ThemeLayoutProps) => {
    return (
        <>
            <TopBar />
            <div className="dash-board-main-wrapper">
                <LeftSidebar />
                {children}
                <RightSidebar />


            </div>
        </>
    );
};

export default ThemeLayout;