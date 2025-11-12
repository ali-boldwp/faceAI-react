import React, { useState, useEffect } from "react";
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
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { PiSmileyWinkBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { RootState } from "Slices/theme/store";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {useMainContext} from "../context/useMainContext";

interface SidebarItem {
  name: string;
}
interface LeftSidebarProps {
  sidebarItems: SidebarItem[];
  imagePreviews: string[];
   answers: { [key: string]: string | string[] };
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string | string[] }>>;
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


const LeftSidebar: React.FC<LeftSidebarProps> = ({ sidebarItems, imagePreviews, answers, setAnswers }) => {
  const location = useLocation();
  const themeSidebarToggle = useSelector(
    (state: RootState) => state.theme.themeSidebarToggle
  );
  const themeType = useSelector((state: RootState) => state.theme.themeType);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const api = useMainContext();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [aiPersonality, setAiPersonality] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);


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

  useEffect(() => {
    const prevAnswer = answers[sidebarItems[step].name];
    if (prevAnswer) {
      setSelectedOption(Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer]);
    } else {
      setSelectedOption([]);
    }
  }, [step, answers, sidebarItems]);

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
useEffect(() => {
  if (!id) {
    // ✅ Jab new chat start ho (no id in URL), sab reset kar do
    setAnswers({});
    setSelectedOption([]);
    setStep(0);
  }
}, [id, setAnswers]);

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

      // ✅ Use api from MainContext instead of axios
      const res = await toast.promise(api.createFaceProfile(payload), {
        loading: "Se salvează profilul...",
        success: "Profilul a fost salvat cu succes!",
        error: "Salvarea profilului a eșuat.",
      });

      setRefreshTrigger(prev => prev + 1);

      if (res.data?.aiPersonality) {
        setAiPersonality(res.data.aiPersonality);
      }

      const newProfileId = res.data?._id;
      if (newProfileId) {
        window.dispatchEvent(new Event("refreshChatHistory"));
        navigate(`/${newProfileId}`);
      }

      setRefreshTrigger(prev => prev + 1);
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
      alert(`🤖 Date preluate de AI:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      console.error("❌ Eroare API:", err);
      alert("Apelul API a eșuat!");
    }
  };

  const handleCheckboxChange = (value: string) => {
    if (selectedOption.includes(value)) {
      setSelectedOption(selectedOption.filter((opt) => opt !== value));
    } else {
      setSelectedOption([...selectedOption, value]);
    }
  };

  const currentOptions = optionsData[sidebarItems[step].name] || [];



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
    <div className={`left-side-bar ${themeSidebarToggle ? "collapsed" : ""}`} style={{ borderLeft: "1px solid #E5E4FF",  width: id ? "320px" : "620px",}}>
      <div className="inner" style={{ height: "100%", overflow: "auto" }}>
        <div className="single-menu-wrapper">


          {(id) ? <>
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
            ))}</> : <div >
            <h4>{submitting ? "Se trimite..." : `Selectează opțiunea pentru:`}</h4>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >

                <h6>{sidebarItems[step].name}</h6>
                <div style={{ width:"100%",height:"60vh",overflowY:"auto" }}>
                {currentOptions.map((opt) => (
                  <label
                    key={opt}
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      value={opt}
                      checked={selectedOption.includes(opt)}
                      onChange={() => handleCheckboxChange(opt)}
                      disabled={submitting}
                      style={{ marginRight: "8px" }}
                    />
                    {opt}
                  </label>
                ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="popup-footer" style={{position:"absolute",bottom:"10px",width:"90%"}}>
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

            </div>
           </div>
          }
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
