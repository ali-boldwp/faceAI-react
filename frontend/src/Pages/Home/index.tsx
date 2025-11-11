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


interface HomeProps {
  sidebarItems: { name: string }[];
  answers: { [key: string]: string | string[] };
  setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string | string[] }>>;
}


const Home: React.FC<HomeProps> = ({ sidebarItems, answers, setAnswers }) => {
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
      setAiPersonality("")
      return
    }


    const fetchProfile = async () => {
      try {
        setSubmitting(true);

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/face-profiles/${id}`);
        if (!res.data.success) throw new Error("Profile not found");

        const profile = res.data.data;

        setFiles(
          profile.images?.map((url: string) => new File([], "placeholder.jpg")) || []
        );
        setAiPersonality(profile?.aiPersonality)
        setImagePreviews(profile.images || []);
        setAnswers(
          profile.questions?.reduce((acc: any, q: any) => {
            acc[q.question] = q.answer;
            return acc;
          }, {}) || {}
        );

        setIsExistingProfile(profile.images?.length > 0 || profile.questions?.length > 0);

        setStep(0);
        setSelectedOption([]);
      } catch (err: any) {
        console.error("Failed to load profile:", err.message);
        toast.error("Failed to load profile data");
      } finally {
        setSubmitting(false);
      }
    };




    fetchProfile();
  }, [id]);




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
      console.error("❌ Cloudinary upload failed:", err.message);
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

  const handleNext = async () => {
    if (selectedOption && selectedOption.length > 0) {
      setAnswers((prev) => ({
        ...prev,
        [sidebarItems[step].name]: selectedOption,
      }));
      setSelectedOption([]);
    }


    if (step < sidebarItems.length - 1) {
      setStep(step + 1);
    } else {
      await submitData();
    }
  };


  const submitData = async () => {
    try {
      setSubmitting(true);

      const questionsArray = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer: Array.isArray(answer) ? answer : [answer],
      }));


      const now = new Date();
      const title = `Face Profile – ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

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
          loading: "Saving profile...",
          success: "Profile saved successfully!",
          error: "Failed to save profile.",
        }
      );

      setRefreshTrigger(prev => prev + 1);

      if (res.data?.data?.aiPersonality) {
        setAiPersonality(res.data.data.aiPersonality);
      }

      // ✅ Redirect to the sidebar route with the new profile ID
      const newProfileId = res.data?.data?._id;
      if (newProfileId) {
        navigate(`/${newProfileId}`);
      }

      setRefreshTrigger((prev) => prev + 1);
      console.log("✅ Saved successfully");
    } catch (error) {
      console.error("❌ Error submitting data:", error);
      toast.error("Something went wrong while submitting!");
    } finally {
      setSubmitting(false);
    }
  };


  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClick = async () => {
    try {
      console.log("👾 Calling random API...");
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/face/shape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front_image_url: "https://res.cloudinary.com/dxcocwxzs/image/upload/v1762436079/wre7a82g4lojlbem3dl8.jpg",
          side_image_url: "https://res.cloudinary.com/dxcocwxzs/image/upload/v1762436083/zdg2deynsyjvg1dcmojz.jpg",
        }),

      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("✅ API Response:", data);
      alert(`🤖 AI fetched data:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      console.error("❌ API Error:", err);
      alert("API call failed!");
    }
  };


  const optionsData: Record<string, string[]> = {
    "Face Shape": [
      "Round Face",
      "Oval Face",
      "Oblong (Long) Face",
      "Triangular Face",
      "Heart-Shaped Face",
      "Square Face",
      "Rectangular Face",
      "Diamond Face",
      "Upward Trapezoid Face",
      "Downward Trapezoid Face",
      "Wide Face",
      "Narrow Face"
    ],
    "Forehead": [
      "Square Forehead / Frunte pătrată –",
      "Round Forehead / Frunte rotundă",
      "High Forehead / Frunte înaltă",
      "Low Forehead / Frunte joasă",
      "Wide Forehead / Frunte lată",
      "Narrow Forehead / Frunte îngustă",
      "Bulging Forehead / Frunte bombată",
      "Straight Forehead / Frunte dreaptă",
      "Sloping Forehead / Frunte înclinată",
      "Jagged/Irregular Forehead / Frunte dantelată",
      "Prominent Brow Ridges / Arcade proeminente",
      "Smooth Brow (No Brow Ridges) / Fără arcade proeminente",
      "Fleshy Brow between Eyes / Umflătură cărnoasă între sprâncene"
    ],
    "Eyebrows": [
      "New Moon” Eyebrows (Arched)/ Sprâncene lună nouă (arcuite) ",
      "Triangular Eyebrows (Angular)/ Sprâncene triunghiulare (sabie)",
      "Straight Eyebrows / Sprâncene drepte",
      "Frowning” Up-Curved Eyebrows / Sprâncene încruntate (curbate în sus) ",
      "Ascending Eyebrows / Sprâncene ascendente",
      "Descending (“Sad”) Eyebrows / Sprâncene triste (descendente)",
      "High-Set Eyebrows / Sprâncene înalte",
      "Low-Set Eyebrows / Sprâncene joase",
      "Close (Narrow) Eyebrow Gap / Sprâncene apropiate",
      "Unibrow / Sprâncene unite",
      "Wide Brow Gap / Sprâncene depărtate",
      "Long Eyebrows / Sprâncene lungi",
      "Short Eyebrows / Sprâncene scurte",
      "Separated Eyebrows / Sprâncene despărțite",
      "Asymmetric Eyebrows / Sprâncene asimetrice",
      "Thick Eyebrows / Sprâncene dese (groase)",
      "Thin Eyebrows / Sprâncene rare (subțiri)",
      "Bushy Eyebrows / Sprâncene încâlcite (stufoase)",
      "Straight-haired Inner Brow / Sprâncene cu păr drept la început",
      "Scattered-haired Eyebrows / Sprâncene cu păr împrăștiat",
      "Chameleon” Eyebrows / Sprâncene cameleon"
    ],
    "Eyes": [
      "Deer Eyes / Ochi de căprioară ",
      "Camel Eyes / Ochi de cămilă",
      "Horse Eyes / Ochi de cal",
      "Heavy Horse Eyes / Ochi de cal greu",
      "Eagle Eyes / Ochi de vultur",
      "Owl Eyes / Ochi de bufniță",
      "Peacock Eyes / Ochi de păun",
      "High Peacock Eyes / Ochii de păun înalt ",
      "Ostrich Eyes / Ochi de struț ",
      "Ostrich Eyes / Ochi de struț ",
      "Lion Eyes / Ochi de leu",
      "Cat Eyes / Ochi de pisică ",
      "Fox Eyes / Ochi de vulpe",
      "Whale Eyes / Ochi de balenă",
      "Dolphin Eyes / Ochi de delfin",
      "Half-Moon Eyes / Ochi semilună",
      "New Moon Eyes / Ochi lună nouă",
      "Wide-Set Eyes / Ochi depărtați ",
      "Close-Set Eyes / Ochi apropiați ",
      "Deep-Set Eyes (Hidden Lids) / Ochi adânciți, fără pleoape vizibile",
      "Deep-Set Eyes (Visible Lids) / Ochi adânciți, cu pleoape vizibile",
      "Bulging Eyes / Ochi bulbucați",
      "Visible Upper Sclera / Sclera vizibilă în partea superioară",
      "Visible Lower Sclera / Sclera vizibilă în partea inferioară",
      "Visible Sclera All Around / Sclera vizibilă sus și jos",
      "Iris Smaller than White / Irisul mai mic decât sclera ",
      "Iris Larger than White / Irisul mai mare decât sclera ",
      "Dilated Pupils / Pupile dilatate",
      "Constricted Pupils / Pupile contractate ",
      "Premonition Points” / Punctele premoniției ",
      "Under-Eye Bags / Pungi sub ochi",
      "Short Eyelashes / Gene scurte",
      "Long Eyelashes / Gene lungi",
      "Heavy Upper Eyelids / Pleoape grele",
      "Drooping Lids (Fully) / Pleoape căzute pe tot ochiul",
      "Drooping Lids (Outer Corners) / Pleoape căzute pe exteriorul ochiului",
      "Straight Lower Eyelids / Pleoape inferioare drepte",
      "Curved Lower Eyelids / Pleoape inferioare curbate",
      "Hooded Upper Eyelids / Pleoape superioare acoperite ",
      "Visible Upper Eyelid (Double Lid) / Pleoape superioare vizibile",
      "Slightly Visible Upper Eyelid / Pleoape superioare puțin vizibile",
    ],
    "Nose": [
      "Fleshy Bridge / Pod cărnos",
      "Straight Bridge (“Greek nose”) / Pod drept (nas grecesc) ",
      "Roman Nose (Small Bump) / Nas roman ",
      "Aquiline (Hooked) Bridge / Pod cu os proeminent (nas acvilin)",
      " Nubian Nose (Wide base) / Nasul nubian",
      "Arched or Humped Bridge / Pod arcuit (cocoșat) ",
      "Bumpy Bridge / Pod denivelat",
      "Crooked Bridge / Pod deformat (strâmb)",
      "Deviated Bridge Right / Pod deviat spre dreapta",
      "Deviated Bridge Left / Pod deviat spre stânga ",

    ],
    "Cheeks and Cheekbones": [
      "Full Cheeks / Obraji umflați (plini)",
      "Hollow Cheeks / Obraji scobiți",
      "Lower Cheek-Jowls (“Bulldog” Cheeks) / Obraji inferiori proeminenți (fălcoșii)",
      "Fleshy Cheekbones / Pomeți cărnoși",
      "Bony Cheekbones / Pomeți osoși",
      "Flat Cheekbones / Pomeți plați",
      "High Cheekbones / Pomeți înalți (ridicați) ",
      "Low Cheekbones / Pomeți joși",
      "Cheekbones Near Nose (Front-Set) / Pomeți apropiați de nas",
      "Cheekbones Near Ears (Side-Set) / Pomeți apropiați de urechi",
    ],
    "Mouth and Lips": [
      "Both Lips Full / Buze cărnoase (pline)",
      "Both Lips Thin / Buze subțiri ",
      "Medium (Balanced) Lips / Buze medii (obișnuite)",
      "Short, Pouty Lips / Buze mici (scurte) și voluminoase în centru",
      "Straight Lip Line / Linie orizontală între buze",
      "Wavy Lip Line / Linie ondulată între buze",
      "Down-turned Lip Corners / Colțurile buzelor în jos ",
      "Up-turned Lip Corners / Colțurile buzelor în sus",
      "Pursed (Protruding) Lips / Buze țuguiate",
      "Upper Lip Fuller than Lower / Buză superioară mai plină decât inferioară ",
      "Lower Lip Fuller than Upper / Buză inferioară mai plină decât superioară ",
      "Protruding Lower Lip / Buza inferioară împinsă în față ",
      "Upper Lip Juts Out / Buza superioară iese în afară ",
      "Epicurean Mouth (Full Projection) / Gură “epicureică” (ieșită în afară)",
      "Micro-Movements of Lower Lip / Coborâre mijlocie a buzei inferioare ",
      "Lower Lip Muscle Bumps / Umflături sub buza inferioară",
      "Chin Dimple (Cleft Chin) / Gropiță în bărbie",
    ],
    "Chin and Jawline": [
      "Rounded Chin / Bărbie rotunjită ",
      "Pointed Chin / Bărbie ascuțită",
      "Square Chin / Bărbie pătrată",
      "Protruding Chin / Bărbie proeminentă",
      " Receding Chin / Bărbie retrasă",
      "Strong Jawline / Maxilar puternic (proeminent)",
      "Weak Jawline / Maxilar slab (slab definit) ",
      "Wide Jaw / Maxilar lat",
      "Narrow Jaw / Maxilar îngust",
      "Jaw Corner Angle (Blunt vs. Sharp) / Unghiul maxilarului blând vs. pronunțat ",
      "Asymmetric Jaw / Maxilar asimetric",
      "Double Chin / Gușă (bărbie dublă) ",
      "Receding Jaw (Retrognathism) / Maxilar retras ",
      "Prognathic Jaw / Maxilar prognat",
    ],
    "Ear (Urechile)": [
      "High-Set Ears / Urechi înalte ",
      "Low-Set Ears / Urechi joase",
      "Centrally Aligned Ears / Urechi mijlocii",
      "Uneven Height Ears / Urechi poziționate inegal",
      "Ears Flat Against Head / Urechi lipite de cap",
      "Protruding Ears / Urechi depărtate de cap (decolate)",
      "Ears Tilted Backward / Urechi înclinate spre spate",
      "Ears Tilted Forward / Urechi înclinate spre față",
      "Vertical Ears / Urechi drepte ",
      "Ears Close to Face / Urechi apropiate de chip",
      "Ears Away from Face / Urechi depărtate de chip",
      "Large Ears / Urechi mari",
      "Medium Ears / Urechi medii",
      "Small Ears / Urechi mici",
      "Different-Sized Ears / Urechi de mărimi diferite",
      "Hairy Ears / Urechi păroase",
      "Deformed Ears / Urechi deformate",
      "Pale Ears / Urechi palide ",
      "Grayish Ears / Urechi gri",
      "Reddish Ears / Urechi roșiatice",
      "Brownish Ears / Urechi maronii",
      "Visible Red Veins on Ears / Vene roșii pe urechi",
      "Pronounced Ear Cartilage Inside / Cartilaj interior evidențiat ",
      "Large Earlobe Hole / Gaură mare în lobul urechii",
      "Small Earlobe Hole / Gaură mică în lobul urechii",
    ],
    "Neck and Throat": [
      "Thick Neck / Gât gros",
      "Thin Neck / Gât subțire",
      "Long Neck / Gât lung",
      "Short Neck / Gât scurt ",
      "Sharp Mento-Cervical Angle / Unghi mento-cervical ascuțit ",
      "Obtuse Mento-Cervical Angle / Unghi mento-cervical obtuz ",
      "Prominent Adam's Apple / “Mărul lui Adam” proeminent ",
      "Neck Folds or Rings / Pliuri pe gât (linii ale gâtului)",
      "Visible Neck Tendons / Tendoane vizibile pe gât",
      "Inclined Head Posture / Cap aplecat sau înclinat",
    ],
    "Skin Texture and Facial Wrinkles": [
      "Smooth, Oily Skin / Ten neted, gras",
      "Dry, Matte Skin / Ten uscat, mat",
      "Freckles or Sunspots / Pistrui sau pete solare",
      " Facial Moles (Beauty Marks) / Alunițe pe față",
      "Facial Scars / Cicatrici faciale",
      "Acne or Blemishes / Acnee sau pete",
      " Facial Redness / Roșeață în obraz",
      " Sagging or Firm Skin ",
      "Facial Hair (Unusual) / Păr facial (excesiv)",
    ]
  }


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
                  <div key={i} className="uploaded-image-box">
                    <img src={src} alt={`Preview ${i}`} className="uploaded-image" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="drop-zone-inner">
                <label htmlFor="fileInput" className="browse-link">
                  <FiUploadCloud className="upload-icon" />
                  <h4>{uploading ? "Uploading..." : "Drag & Drop or Select file"}</h4>
                  <p>Drop files here or click to browse</p>
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
              <div className="popup">
                <h4>{submitting ? "Submitting..." : `Select Option for:`}</h4>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="labelBtn">
                      <label>{sidebarItems[step].name}</label>
                      <button className="ask-ai-btn" onClick={handleClick}>
                        Ask by AI
                      </button>
                    </div>
                    <Select
                        isMulti
                        isSearchable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select options..."
                        value={selectedOption.map((opt) => ({ value: opt, label: opt }))}
                        options={optionsData[sidebarItems[step].name]?.map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                        onChange={(selected) => {
                          if (!selected) {
                            setSelectedOption([]);
                          } else {
                            setSelectedOption(selected.map((s) => s.value));
                          }
                        }}
                        isDisabled={submitting}
                    />





                  </motion.div>
                </AnimatePresence>

                <div className="popup-footer">
                  <div className="arrow-buttons">
                    <button
                      className="arrow-btn left"
                      onClick={handlePrev}
                      disabled={step === 0 || submitting}
                    >
                      <FiArrowLeft size={20} />
                    </button>
                    <button
                      className="arrow-btn right"
                      onClick={handleNext}
                      disabled={submitting}
                    >
                      <FiArrowRight size={20} />
                    </button>
                  </div>
                  <span className="step-counter">
                    {step + 1} / {sidebarItems.length}
                  </span>
                  <button
                    className="next-btn"
                    onClick={handleNext}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : step < sidebarItems.length - 1
                        ? "Next"
                        : "Finish"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
      <RightSidebar
        startNewChat={resetHomeScreen}
        refreshTrigger={refreshTrigger}
      />

      <LeftSidebar sidebarItems={sidebarItems} answers={answers} />


    </>
  );
};

export default Home;