import React, { useEffect, useState, DragEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";
import useSidebarToggle from "Common/UseSideberToggleHooks";
import "./home.css";

const Home = () => {
  const themeSidebarToggle = useSidebarToggle();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Add/remove chatbot body class
  useEffect(() => {
    document.body.classList.add("chatbot");
    return () => document.body.classList.remove("chatbot");
  }, []);

  // Scroll logic for sticky search form
  useEffect(() => {
    const handleScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      const threshold = 200;
      const searchForm: HTMLElement | null = document.querySelector(".chatbot .search-form");

      if (searchForm) {
        if (distanceFromBottom < threshold) searchForm.classList.add("active");
        else searchForm.classList.remove("active");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle file drop
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

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setFiles((prev) => [...prev, ...imageFiles]);
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  return (
    <div
      className={`main-center-content-m-left center-content search-sticky ${
        themeSidebarToggle ? "collapsed" : ""
      }`}
    >
      {/* ✅ Uploaded Image Previews */}
     

      {/* ✅ Upload Section */}
      <div className="upload-section">
         {imagePreviews.length > 0 && (
        <div className="uploaded-image-container multiple">
          {imagePreviews.map((src, index) => (
            <div key={index} className="uploaded-image-box">
              <img src={src} alt={`Preview ${index}`} className="uploaded-image" />
            </div>
          ))}
        </div>
      )}
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {/* Hide text when at least one image is uploaded */}
          {imagePreviews.length === 0 && (
            <div className="drop-zone-inner">
              <FiUploadCloud className="upload-icon" />
              <div>
                <h4>Drag & Drop or Select file</h4>
                <p>
                  Drop files here or click{" "}
                  <label htmlFor="fileInput" className="browse-link">
                    browse
                  </label>{" "}
                  through your machine
                </p>
              </div>
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
      </div>

      {/* ✅ Popup appears after first image upload */}
      {files.length > 0 && (
        <div className="popup">
          <h4>Select Shapes</h4>

          <div className="form-group">
            <label htmlFor="faceShape">Face Shape :</label>
            <select id="faceShape" className="shape-select">
              <option value="">-- Select Face Shape --</option>
              <option value="oval">Oval</option>
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="heart">Heart</option>
              <option value="diamond">Diamond</option>
              <option value="oblong">Oblong</option>
              <option value="triangle">Triangle</option>
            </select>
          </div>

          <div className="popup-footer">
            <div className="arrow-buttons">
              <button className="arrow-btn left">←</button>
              <button className="arrow-btn right">→</button>
            </div>
            <button className="next-btn">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
