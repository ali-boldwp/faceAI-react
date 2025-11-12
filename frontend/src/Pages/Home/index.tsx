import React, { useEffect, useState, DragEvent } from "react";
import axios from "axios";
import { FiUploadCloud, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useSidebarToggle from "Common/UseSideberToggleHooks";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "../../ThemeLayout/LeftSidebar";
import { useNavigate, useParams } from "react-router-dom";
import "./home.css";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import Select from "react-select";
import {useMainContext} from "../../context/useMainContext";


interface HomeProps {
  sidebarItems: { name: string }[];
  answers: { [key: string]: string | string[] };
  setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string | string[] }>>;
}


const Home: React.FC<HomeProps> = ({ sidebarItems, answers, setAnswers }) => {
  const { getFaceProfile  } = useMainContext();
  const api = useMainContext();
  const themeSidebarToggle = useSidebarToggle();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [aiPersonality, setAiPersonality] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      setFiles([]);
      setImagePreviews([]);
      setStep(0);
      setSelectedOption([]);
      setAnswers({});
      setAiPersonality("");
      setIsExistingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setSubmitting(true);

        const res = await getFaceProfile(id);

        if (!res?.success) throw new Error("Profilul nu a fost găsit");

        const profile = res.data;

        setFiles(profile.images?.map((url: string) => new File([], "placeholder.jpg")) || []);
        setImagePreviews(profile.images || []);
        setAiPersonality(profile?.aiPersonality || "");

        const newAnswers: { [key: string]: string | string[] } =
            profile.questions?.reduce((acc: any, q: any) => {
              acc[q.question] = q.answer;
              return acc;
            }, {}) || {};

        setAnswers(newAnswers);
        console.log("Fetched answers:", newAnswers);

        setIsExistingProfile(profile.images?.length > 0 || profile.questions?.length > 0);

        setStep(0);
        setSelectedOption([]);
      } catch (err: any) {
        console.error("Încărcarea profilului a eșuat:", err.message);
        toast.error("Încărcarea datelor profilului a eșuat");
      } finally {
        setSubmitting(false);
      }
    };

    fetchProfile();
  }, [id, getFaceProfile]);




  useEffect(() => {
    document.body.classList.add("chatbot");
    return () => document.body.classList.remove("chatbot");
  }, []);

  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "");
    formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "");

    try {
      setUploading(true);
      const res = await axios.post(cloudinaryUploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploading(false);
      return res.data.secure_url;
    } catch (err: any) {
      console.error("❌ Încărcarea pe Cloudinary a eșuat:", err.message);
      setUploading(false);
      return null;
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (droppedFiles.length === 0) return;

    setFiles((prev) => [...prev, ...droppedFiles]);

    const uploadedUrls = await Promise.all(
      droppedFiles.map(async (file) => {
        const url = await uploadToCloudinary(file);
        return url || URL.createObjectURL(file);
      })
    );

    setImagePreviews((prev) => [...prev, ...uploadedUrls]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length === 0) return;

    setFiles((prev) => [...prev, ...imageFiles]);

    const uploadedUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const url = await uploadToCloudinary(file);
        return url || URL.createObjectURL(file);
      })
    );

    setImagePreviews((prev) => [...prev, ...uploadedUrls]);
  };


  const submitData = async () => {
    try {
      setSubmitting(true);

      const questionsArray = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer: Array.isArray(answer) ? answer : [answer],
      }));


      const now = new Date();
      const title = `Profilul feței – ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      const payload = {
        title,
        images: imagePreviews,
        questions: questionsArray,
      };

      const token = localStorage.getItem("token");

      const res = await toast.promise(
        axios.post(
          `${process.env.REACT_APP_API_URL}/face-profiles`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          loading: "Se salvează profilul...",
          success: "Profilul a fost salvat cu succes!",
          error: "Salvarea profilului a eșuat.",

        }
      );

      setRefreshTrigger(prev => prev + 1);

      if (res.data?.data?.aiPersonality) {
        setAiPersonality(res.data.data.aiPersonality);
      }


      const newProfileId = res.data?.data?._id;
      if (newProfileId) {
        navigate(`/${newProfileId}`);
      }

      setRefreshTrigger((prev) => prev + 1);
      console.log("✅ Salvat cu succes");
    } catch (error) {
      console.error("❌ Eroare la trimiterea datelor:", error);
      toast.error("Ceva nu a mers bine la trimitere!");
    } finally {
      setSubmitting(false);
    }
  };


  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClick = async () => {
    try {
      console.log("👾 Calling Face Shape API...");

      const data = await api.analyzeFaceShape(
          "https://res.cloudinary.com/dxcocwxzs/image/upload/v1762436079/wre7a82g4lojlbem3dl8.jpg",
          "https://res.cloudinary.com/dxcocwxzs/image/upload/v1762436083/zdg2deynsyjvg1dcmojz.jpg"
      );

      console.log("✅ API Response:", data);
      alert(`🤖 Date preluate de AI:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      alert("Apelul API a eșuat!");
    }
  };



  const resetHomeScreen = () => {
    navigate(`/`);
  };



  return (
    <>
      <div
        className={`main-center-content-m-left center-content search-sticky ${themeSidebarToggle ? "collapsed" : ""
          }`}
      >
        {(!id)
          ? <>  <div
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {imagePreviews.length > 0 ? (
              <div className="uploaded-image-container multiple">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="uploaded-image-box"  style={{ height: "350px", width: "auto"}}>
                    <img src={src} alt={`Preview ${i}`} className="uploaded-image" style={{ height: "350px", width: "auto"}} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="drop-zone-inner">
                <label htmlFor="fileInput" className="browse-link">
                  <FiUploadCloud className="upload-icon" />
                  <h4>{uploading ? "Se încarcă..." : "Trage și plasează sau selectează fișierul"}</h4>
                  <p>Trage fișierele aici sau fă clic pentru a răsfoi</p>
                </label>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-input"
            />
          </div></> : <>
            <div className="uploaded-image-container multiple" style={{ paddingBottom: "20px" }}>
              {imagePreviews.map((src, i) => (
                <div key={i} className="uploaded-image-box">
                  <img src={src} alt={`Preview ${i}`} className="uploaded-image" />
                </div>
              ))}
            </div>
          </>
        }

        {files.length > 0 && (
          <>
            {(id) ? (
              <div
                className="ai-personality-section"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(aiPersonality),
                }}
              />
            ) : (
          <></>
            )}
          </>
        )}

      </div>
      <RightSidebar
        startNewChat={resetHomeScreen}
        refreshTrigger={refreshTrigger}
      />

      <LeftSidebar sidebarItems={sidebarItems} imagePreviews={imagePreviews}  answers={answers} setAnswers={setAnswers}/>


    </>
  );
};

export default Home;
