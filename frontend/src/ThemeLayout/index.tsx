import React, {ReactNode, useState} from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "Pages/Home/RightSidebar";
import Image from "../assets/faces/image16.jpg"

interface ThemeLayoutProps {
    children: ReactNode;
}

const ThemeLayout = ({children}: ThemeLayoutProps) => {
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});

    const sidebarItems = [
        {
            name: "Face Shape",
            images: {
                "Round Face": Image,
                "Oval Face": Image,
                "Oblong (Long) Face": Image
            }
        },
        {name: "Forehead"},
        {name: "Eyebrows"},
        {name: "Eyes"},
        {name: "Nose"},
        {name: "Cheeks and Cheekbones"},
        {name: "Mouth and Lips"},
        {name: "Chin and Jawline"},
        {name: "Ear (Urechile)"},
        {name: "Neck and Throat"},
        {name: "Skin Texture and Facial Wrinkles"},
    ];

    const childrenWithProps = React.cloneElement(children as React.ReactElement, {
        sidebarItems,
        answers,
        setAnswers,
    });

    return (
        <>
            <TopBar/>
            <div className="dash-board-main-wrapper">
                {/* <LeftSidebar sidebarItems={sidebarItems} answers={answers} /> */}
                {childrenWithProps}
                {/*<RightSidebar />*/}
            </div>
        </>
    );
};

export default ThemeLayout;
