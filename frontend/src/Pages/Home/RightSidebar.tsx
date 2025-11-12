import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import toast from "react-hot-toast";

// Import images
import logo02 from "assets/images/logo/logo-02.png";
import icons04 from "assets/images/icons/04.png";
import icons05 from "assets/images/icons/05.svg";
import icons01 from "assets/images/icons/01.svg";

interface RightSidebarProps {
    startNewChat?: () => void;
    onSelectProfile?: (profileId: string) => void;
    refreshTrigger?: number;
}

interface FaceProfile {
    _id: string;
    title: string;
    createdAt: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    startNewChat,
    onSelectProfile,
    refreshTrigger,
}) => {
    const [isToggleRightSidebar, setIsToggleRightSidebar] = useState<boolean>(true);
    const [history, setHistory] = useState<FaceProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<FaceProfile | null>(null);

    const navigate = useNavigate();

    const toggleRightSidebar = () => setIsToggleRightSidebar(!isToggleRightSidebar);

    const handleHistoryClick = (profile: FaceProfile) => {
        if (profile._id) {
            setActiveProfileId(profile._id);
            navigate(`/${profile._id}`);
            onSelectProfile?.(profile._id);
        } else {
            startNewChat?.();
        }
    };

    const resetHomeScreen = () => {
        setActiveProfileId(null);
        navigate(`/`);
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/face-profiles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.success) {
                const sorted = res.data.data.sort(
                    (a: FaceProfile, b: FaceProfile) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setHistory(sorted);
            }
        } catch (err) {
            console.error("Error fetching chat history:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);


    const handleDeleteProfile = async (id: string) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/face-profiles/${id}`);

            // Remove from local history
            setHistory((prev) => prev.filter((p) => p._id !== id));
            if (activeProfileId === id) setActiveProfileId(null);


            toast.success("Profile deleted successfully");
        } catch (err) {
            console.error("Error deleting profile:", err);


            toast.error("Failed to delete profile");
        }
    };

    const groupHistoryByDate = (items: FaceProfile[]) => {
        const groups: Record<string, FaceProfile[]> = {};

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formatDate = (date: Date) => date.toISOString().split("T")[0];
        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);

        items.forEach((item) => {
            const itemDate = formatDate(new Date(item.createdAt));
            let groupKey;
            if (itemDate === todayStr) groupKey = "Astăzi";
            else if (itemDate === yesterdayStr) groupKey = "Ieri";
            else
                groupKey = new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(item);
        });

        return groups;
    };

    const groupedHistory = groupHistoryByDate(history);

    return (
        <div className={`right-side-bar-new-chat-option ${isToggleRightSidebar ? "" : "close-right"}`} style={{ borderRight: "1px solid #E5E4FF" }}>
            {/* New Chat Button */}
            <div className="new-chat-option">
                <button
                    onClick={resetHomeScreen}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer',justifyContent: 'center', }}
                >
                    <p style={{ margin: 0 }}>Conversație nouă</p>
                    <img src={icons04} alt="icons" style={{ width: '20px', height: '20px' }} />
                </button>
            </div>


            {/* Chat History */}
            <div className="chat-history-wrapper">
                {loading ? (
                    <p style={{ padding: "10px" }}>Loading...</p>
                ) : history.length === 0 ? (
                    <p style={{ padding: "10px" }}>No history found.</p>
                ) : (
                    Object.entries(groupedHistory).map(([group, profiles]) => (
                        <div key={group} className="chat-group">
                            <h6 style={{ padding: "8px 10px", fontWeight: "bold", color: "#888" }}>{group}</h6>
                            {profiles.map((profile) => (
                                <div
                                    key={profile._id}
                                    className={`chat-history-area-start ${activeProfileId === profile._id ? "active-profile" : ""}`}
                                >
                                    <div className="single-history" onClick={() => handleHistoryClick(profile)}>
                                        <p>{profile.title}</p>

                                        <IoTrashOutline
                                            className="delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProfileToDelete(profile);
                                                setShowDeleteModal(true);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Toggle Sidebar */}
            <div onClick={toggleRightSidebar} className="right-side-open-clouse" id="collups-right">
                <img src={icons01} alt="icons" />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && profileToDelete && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Șterge profilul?</h3>
                        <p>Ești sigur că vrei să ștergi "{profileToDelete.title}"?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                                Anulează
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={async () => {
                                    await handleDeleteProfile(profileToDelete._id);
                                    setShowDeleteModal(false);
                                }}
                            >
                                Șterge
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RightSidebar;
