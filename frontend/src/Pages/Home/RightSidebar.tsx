import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import images
import logo02 from "assets/images/logo/logo-02.png";
import icons04 from "assets/images/icons/04.png";
import icons05 from "assets/images/icons/05.svg";
import icons01 from "assets/images/icons/01.svg";


interface RightSidebarProps {
    startNewChat?: () => void;
    onSelectProfile?: (profileId: string) => void;
}




interface FaceProfile {
    _id: string;
    title: string;
    createdAt: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ startNewChat , onSelectProfile }) => {
    const [isToggleRightSidebar, setIsToggleRightSidebar] = useState<boolean>(true);
    const [history, setHistory] = useState<FaceProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleRightSidebar = () => setIsToggleRightSidebar(!isToggleRightSidebar);

    const handleHistoryClick = (profile: FaceProfile) => {
        if (profile._id) {
            navigate(`/${profile._id}`); // ✅ React Router way
            onSelectProfile?.(profile._id);
        } else {
            startNewChat?.();
        }
    };

    const resetHomeScreen = () => {
        navigate(`/`); // ✅ React Router way

    };



    // ✅ Fetch chat history from backend
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/face-profiles");
            if (res.data.success) {
                setHistory(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching chat history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className={`right-side-bar-new-chat-option ${isToggleRightSidebar ? "" : "close-right"}`}>
            {/* New Chat Button */}
            <div className="new-chat-option">
                <button onClick={() => {
                    resetHomeScreen()
                }} className="new-chat-btn">
                <img src={logo02} alt="logo" />
                <img src={icons04} alt="icons" />


                </button>
            </div>

            {/* Chat History */}
            <div className="chat-history-wrapper">
                {loading ? (
                    <p style={{ padding: "10px" }}>Loading...</p>
                ) : history.length === 0 ? (
                    <p style={{ padding: "10px" }}>No history found.</p>
                ) : (
                    history.map((profile) => {
                        const date = new Date(profile.createdAt).toLocaleDateString();
                        return (
                            <div key={profile._id} className="chat-history-area-start"  onClick={() => handleHistoryClick(profile)}>
                                <h6 className="title">{date}</h6>
                                <div className="single-history">
                                    <p>{profile.title}</p>
                                    <img src={icons05} alt="icons" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>


            {/* Toggle Sidebar */}
            <div onClick={toggleRightSidebar} className="right-side-open-clouse" id="collups-right">
                <img src={icons01} alt="icons" />
            </div>
        </div>
    );
};

export default RightSidebar;
