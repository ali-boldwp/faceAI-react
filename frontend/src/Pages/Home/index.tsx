import React, { useEffect, useState, DragEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useSidebarToggle from "Common/UseSideberToggleHooks";
import "./home.css";

interface HomeProps {
  sidebarItems: { name: string }[];
  answers: { [key: string]: string };
  setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const Home: React.FC<HomeProps> = ({ sidebarItems, answers, setAnswers }) => {
  const themeSidebarToggle = useSidebarToggle();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    document.body.classList.add("chatbot");
    return () => document.body.classList.remove("chatbot");
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      const newPreviews = droppedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setFiles((prev) => [...prev, ...imageFiles]);
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers((prev) => ({
        ...prev,
        [sidebarItems[step].name]: selectedOption,
      }));
      setSelectedOption("");
    }
    if (step < sidebarItems.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div
      className={`main-center-content-m-left center-content search-sticky ${
        themeSidebarToggle ? "collapsed" : ""
      }`}
    >
      {/* ✅ Image Previews */}
      

      {/* ✅ Upload Zone */}
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {imagePreviews.length > 0 && (
        <div className="uploaded-image-container multiple">
          {imagePreviews.map((src, i) => (
            <div key={i} className="uploaded-image-box">
              <img src={src} alt={`Preview ${i}`} className="uploaded-image" />
            </div>
          ))}
        </div>
      )}
        {imagePreviews.length === 0 && (
          <div className="drop-zone-inner">
            <FiUploadCloud className="upload-icon" />
            <h4>Drag & Drop or Select file</h4>
            <p>
              Drop files here or click{" "}
              <label htmlFor="fileInput" className="browse-link">
                browse
              </label>{" "}
              your computer
            </p>
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
      </div>

      {/* ✅ Popup Questions */}
      {files.length > 0 && (
        <div className="popup">
          <h4>Select Option for:</h4>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label>{sidebarItems[step].name}</label>
              <select
                className="shape-select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">-- Select Option --</option>
                <option value="Type A">Type A</option>
                <option value="Type B">Type B</option>
                <option value="Type C">Type C</option>
              </select>
            </motion.div>
          </AnimatePresence>

          <div className="popup-footer">
            <div className="arrow-buttons">
              <button
                className="arrow-btn left"
                onClick={handlePrev}
                disabled={step === 0}
              >
                ←
              </button>
              <button
                className="arrow-btn right"
                onClick={handleNext}
                disabled={step === sidebarItems.length - 1}
              >
                →
              </button>
            </div>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
