import React, {useState, useEffect} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    GiNoseFront,
    GiEyeball,
    GiHeadshot,
    GiAbstract002,
    GiLips,
    GiHumanEar,
    GiBodyHeight,
} from "react-icons/gi";
import {FaRegGrinBeam, FaEye, FaUserCircle} from "react-icons/fa";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import {PiSmileyWinkBold} from "react-icons/pi";
import {useSelector} from "react-redux";
import {RootState} from "Slices/theme/store";
import axios from "axios";
import toast from "react-hot-toast";
import {motion, AnimatePresence} from "framer-motion";
import {InforDataType} from "../Pages/Home";
import Image from "../assets/faces/image16.jpg"

interface SidebarItem {
    name: string;
    images?: Record<string, string>;
}

interface LeftSidebarProps {
    sidebarItems: SidebarItem[];
    imagePreviews: string[];
    answers: { [key: string]: string | string[] };
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string | string[] }>>;
    setInforData: React.Dispatch<React.SetStateAction<InforDataType>>;
    togglePopup: any;
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

const LeftSidebar: React.FC<LeftSidebarProps> = ({
                                                     sidebarItems,
                                                     imagePreviews,
                                                     answers,
                                                     setAnswers,
                                                     setInforData,
                                                     togglePopup
                                                 }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const themeSidebarToggle = useSelector((state: RootState) => state.theme.themeSidebarToggle);
    const themeType = useSelector((state: RootState) => state.theme.themeType);

    const [step, setStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string[]>([]);
    const [customInput, setCustomInput] = useState("");
    const [nameCompleted, setNameCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [aiPersonality, setAiPersonality] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [aiResponse, setAiResponse] = useState<any>(null);


    const icons = [
        <GiHeadshot/>,
        <GiAbstract002/>,
        <FaRegGrinBeam/>,
        <FaEye/>,
        <GiNoseFront/>,
        <GiEyeball/>,
        <GiLips/>,
        <PiSmileyWinkBold/>,
        <GiHumanEar/>,
        <GiBodyHeight/>,
        <FaUserCircle/>,
    ];
    const getIconColor = () => (themeType === "dark" ? "#c5c5c5" : "#001C42");

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
            "Upward Trapezoid Face", // missing
            "Downward Trapezoid Face", // missing
            "Wide Face", // missing
            "Narrow Face" // missing
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


    // Load previous answers when step changes
    useEffect(() => {
        const key = sidebarItems[step]?.name;
        if (!key) return;

        const prev = answers[key];
        setSelectedOption(prev ? (Array.isArray(prev) ? prev : [prev]) : []);
    }, [step]);


    const handleCheckboxChange = (value: string) => {
        setSelectedOption(prev => prev.includes(value) ? prev.filter(opt => opt !== value) : [...prev, value]);
    };

    const handleNext = () => {
        const stepKey = sidebarItems[step]?.name;
        if (!stepKey) return;

        if (step === 0 && !nameCompleted) {
            if (!customInput.trim()) {
                toast.error("Please enter a name!");
                return;
            }
            setAnswers(prev => ({...prev, [stepKey + "_custom"]: customInput.trim()}));
            setNameCompleted(true);
            return;
        }

        if (selectedOption.length === 0) {
            toast.error("Te rog selectează sau completează un răspuns!");
            return;
        }

        setAnswers(prev => ({...prev, [stepKey]: selectedOption}));

        if (step < sidebarItems.length - 1) {
            setStep(prev => prev + 1);
        } else {
            submitData();
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const submitData = async () => {
        try {
            setSubmitting(true);


            const customNameKey = sidebarItems[0].name + "_custom";
            const customName = answers[customNameKey] || "Profilul feței";

            const questionsArray = Object.entries(answers).map(([question, answer]) => ({
                question,
                answer: Array.isArray(answer) ? answer : [answer],
            }));


            const title = `${customName}`;
            const payload = {title, images: imagePreviews, questions: questionsArray};
            const token = localStorage.getItem("token");

            const res = await toast.promise(
                axios.post(`${process.env.REACT_APP_API_URL}/face-profiles`, payload, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
                {
                    loading: "Se salvează profilul...",
                    success: "Profilul a fost salvat cu succes!",
                    error: "Salvarea profilului a eșuat.",
                }
            );

            if (res.data?.data?.aiPersonality) setAiPersonality(res.data.data.aiPersonality);

            const newProfileId = res.data?.data?._id;
            if (newProfileId) {
                window.dispatchEvent(new Event("refreshChatHistory"));
                navigate(`/${newProfileId}`);
            }
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error(err);
            toast.error("Ceva nu a mers bine la trimitere!");
        } finally {
            setSubmitting(false);
        }
    };


    const handleAskByAI = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_AI_URL}/face/full`, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify({
                    ID: "testing",
                    front_image_url: imagePreviews[0],
                    side_image_url: imagePreviews[1] ? imagePreviews[1] : imagePreviews[0],
                }),
            });

            const data = await res.json();
            setAiResponse(data);

            const mapped = autoSelectFromAI(data);
            setAnswers(prev => ({...prev, ...mapped}));


            const currentKey = sidebarItems[step].name;
            if (mapped[currentKey]) {
                setSelectedOption(mapped[currentKey]);
            }

            toast.success("AI suggested options applied!");
        } catch (err) {
            console.error(err);
            toast.error("AI request failed.");
        }
    };

    // Try to pick options whose English part appears in the AI text
    const matchOptionsFromText = (sectionKey: string, text: string): string[] => {
        const options = optionsData[sectionKey] || [];
        const lowerText = text.toLowerCase();

        return options.filter((opt) => {
            const english = opt.split("/")[0].replace(/[”“"]/g, "").trim().toLowerCase();
            if (!english) return false;
            return lowerText.includes(english);
        });
    };


    const autoSelectFromAI = (data: any) => {
        const updates: Record<string, string[]> = {};

        // helper to find a section in the full-analysis JSON
        const getSection = (name: string) =>
            data?.sections?.find((sec: any) => sec.section === name);


        // --------------------------------------------------------
        // 1) Face Shape (top-level)
        // --------------------------------------------------------
        if (data?.primary_shape) {
            const text = String(data.primary_shape);
            const matched = matchOptionsFromText("Face Shape", text);
            if (matched.length) updates["Face Shape"] = matched;
        }


        // --------------------------------------------------------
        // 2) Forehead
        // --------------------------------------------------------
        const foreheadSection = getSection("Forehead");
        if (foreheadSection?.traits?.length) {
            const traitName = String(foreheadSection.traits[0].name || "");
            const matched = matchOptionsFromText("Forehead", traitName);
            if (matched.length) updates["Forehead"] = matched;
        }


        // --------------------------------------------------------
        // 3) Eyebrows (if backend adds this later)
        // --------------------------------------------------------
        const eyebrowsSection = getSection("Eyebrows");
        if (eyebrowsSection?.traits?.length) {
            const traitName = String(eyebrowsSection.traits[0].name || "");
            const matched = matchOptionsFromText("Eyebrows", traitName);
            if (matched.length) updates["Eyebrows"] = matched;
        }


        // --------------------------------------------------------
        // 4) Eyes
        // --------------------------------------------------------
        const eyesSection = getSection("Eyes");
        if (eyesSection?.traits?.length) {
            const traitName = String(eyesSection.traits[0].name || "");
            const matched = matchOptionsFromText("Eyes", traitName);
            if (matched.length) updates["Eyes"] = matched;
        }


        // --------------------------------------------------------
        // 5) Nose
        // --------------------------------------------------------
        const noseSection = getSection("Nose");
        if (noseSection?.traits?.length) {
            const traitName = String(noseSection.traits[0].name || "");
            const matched = matchOptionsFromText("Nose", traitName);
            if (matched.length) updates["Nose"] = matched;
        }


        // --------------------------------------------------------
        // 6) Cheeks and Cheekbones
        // --------------------------------------------------------
        const cheeksSection = getSection("Cheeks and Cheekbones");
        if (cheeksSection?.traits?.length) {
            const traitName = String(cheeksSection.traits[0].name || "");
            const matched = matchOptionsFromText("Cheeks and Cheekbones", traitName);
            if (matched.length) updates["Cheeks and Cheekbones"] = matched;
        }


        // --------------------------------------------------------
        // 7) Mouth and Lips
        // --------------------------------------------------------
        const mouthSection = getSection("Mouth and Lips");
        if (mouthSection?.traits?.length) {
            const traitName = String(mouthSection.traits[0].name || "");
            const matched = matchOptionsFromText("Mouth and Lips", traitName);
            if (matched.length) updates["Mouth and Lips"] = matched;
        }


        // --------------------------------------------------------
        // 8) Chin and Jawline
        // --------------------------------------------------------
        const chinSection = getSection("Chin and Jawline");
        if (chinSection?.traits?.length) {
            const traitName = String(chinSection.traits[0].name || "");
            const matched = matchOptionsFromText("Chin and Jawline", traitName);
            if (matched.length) updates["Chin and Jawline"] = matched;
        }


        // --------------------------------------------------------
        // 9) Ear (Urechile)
        // --------------------------------------------------------
        const earSection = getSection("Ear (Urechile)");
        if (earSection?.traits?.length) {
            const traitName = String(earSection.traits[0].name || "");
            const matched = matchOptionsFromText("Ear (Urechile)", traitName);
            if (matched.length) updates["Ear (Urechile)"] = matched;
        }


        // --------------------------------------------------------
        // 10) Neck and Throat
        // --------------------------------------------------------
        const neckSection = getSection("Neck and Throat");
        if (neckSection?.traits?.length) {
            const traitName = String(neckSection.traits[0].name || "");
            const matched = matchOptionsFromText("Neck and Throat", traitName);
            if (matched.length) updates["Neck and Throat"] = matched;
        }


        // --------------------------------------------------------
        // 11) Skin Texture and Facial Wrinkles
        // --------------------------------------------------------
        const skinSection = getSection("Skin Texture and Facial Wrinkles");
        if (skinSection?.traits?.length) {
            const traitName = String(skinSection.traits[0].name || "");
            const matched = matchOptionsFromText("Skin Texture and Facial Wrinkles", traitName);
            if (matched.length) updates["Skin Texture and Facial Wrinkles"] = matched;
        }


        return updates;
    };


    useEffect(() => {
        if (!id) {
            setAnswers({});
            setSelectedOption([]);
            setStep(0);
            setCustomInput("");
            setNameCompleted(false);
        }
    }, [id, setAnswers]);

    const currentOptions = optionsData[sidebarItems[step]?.name] || [];

    return (
        <div className={`left-side-bar ${themeSidebarToggle ? "collapsed" : ""}`}
             style={{position: 'relative', borderLeft: "1px solid #E5E4FF", width: id ? "320px" : "620px"}}>
            <div className="inner" style={{height: "100%", overflow: "auto"}}>
                <div className="single-menu-wrapper">
                    {id ? (
                        sidebarItems.map((item, index) => (
                            <Link key={index} to="#"
                                  className={`single-menu ${location.pathname === item.name ? "active" : ""}`}>
                                <div className="icon"
                                     style={{fontSize: "20px", color: getIconColor()}}>{icons[index]}</div>
                                <p style={{color: getIconColor()}}>
                                    {nameTranslations[item.name] || item.name}:{" "}
                                    <span style={{color: getIconColor()}}>
                                        {Array.isArray(answers[item.name]) ? (answers[item.name] as string[]).join(", ") : (answers[item.name] as string) || "____"}
                                    </span>
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div>
                            <h4>{submitting ? "Se trimite..." : `Selectează opțiunea pentru:`}</h4>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{x: 50, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    exit={{x: -50, opacity: 0}}
                                    transition={{duration: 0.4}}
                                >

                                    {step === 0 && !nameCompleted ? (
                                        <input
                                            type="text"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Introdu numele"
                                            disabled={submitting}
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                margin: "10px 0",
                                                border: "1px solid #E5E4FF",
                                                borderRadius: 10
                                            }}
                                        />
                                    ) : (

                                        <div style={{width: "100%", height: "60vh", overflowY: "auto"}}>
                                            <h6>{sidebarItems[step].name}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                     style={{marginLeft: '10px', cursor: "pointer"}}
                                                     onClick={() => { setInforData( aiResponse.sections[ step ]); togglePopup( true ); }
                                                         }
                                                     width="15px" height="15px">
                                                    <path fill="#25B7D3"
                                                          d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"/>
                                                    <path fill="#FFF"
                                                          d="M323.2 367.5c-1.4-2-4-2.8-6.3-1.7-24.6 11.6-52.5 23.9-58 25-.1-.1-.4-.3-.6-.7-.7-1-1.1-2.3-1.1-4 0-13.9 10.5-56.2 31.2-125.7 17.5-58.4 19.5-70.5 19.5-74.5 0-6.2-2.4-11.4-6.9-15.1-4.3-3.5-10.2-5.3-17.7-5.3-12.5 0-26.9 4.7-44.1 14.5-16.7 9.4-35.4 25.4-55.4 47.5-1.6 1.7-1.7 4.3-.4 6.2 1.3 1.9 3.8 2.6 6 1.8 7-2.9 42.4-17.4 47.6-20.6 4.2-2.6 7.9-4 10.9-4 .1 0 .2 0 .3 0 0 .2.1.5.1.9 0 3-.6 6.7-1.9 10.7-30.1 97.6-44.8 157.5-44.8 183 0 9 2.5 16.2 7.4 21.5 5 5.4 11.8 8.1 20.1 8.1 8.9 0 19.7-3.7 33.1-11.4 12.9-7.4 32.7-23.7 60.4-49.7C324.3 372.2 324.6 369.5 323.2 367.5zM322.2 84.6c-4.9-5-11.2-7.6-18.7-7.6-9.3 0-17.5 3.7-24.2 11-6.6 7.2-9.9 15.9-9.9 26.1 0 8 2.5 14.7 7.3 19.8 4.9 5.2 11.1 7.8 18.5 7.8 9 0 17-3.9 24-11.6 6.9-7.6 10.4-16.4 10.4-26.4C329.6 96 327.1 89.6 322.2 84.6z"/>
                                                </svg>
                                            </h6>
                                            {currentOptions.map((opt) => {

                                                const currentItem = sidebarItems[step];
                                                const imageSrc = currentItem?.images?.[opt]; // safe access

                                                return(
                                                <label
                                                    key={opt}
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        cursor: submitting ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    { imageSrc ? <img src={ Image } alt={opt} style={{ width: '25px', marginRight: '15px' }} />: <div style={{ width: '25px', marginRight: '15px', display: 'inline-block' }}></div> }
                                                    <input
                                                        type="checkbox"
                                                        value={opt}
                                                        checked={selectedOption.includes(opt)}
                                                        onChange={() => handleCheckboxChange(opt)}
                                                        disabled={submitting}
                                                        style={{marginRight: "8px"}}
                                                    />
                                                    {opt}
                                                </label>
                                            )})}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="popup-footer" style={{position: "absolute", bottom: "10px", width: "90%"}}>
                                <div className="arrow-buttons">
                                    <button className="arrow-btn left" onClick={handlePrev}
                                            disabled={step === 0 || submitting}><FiArrowLeft size={20}/></button>
                                    <button className="arrow-btn right" onClick={handleNext} disabled={submitting}>
                                        <FiArrowRight size={20}/></button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleAskByAI}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#3F3EED",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            fontWeight: 600,
                                            transition: "0.2s ease",
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3a7acc")}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4A90E2")}
                                    >
                                        Ask by AI
                                    </button>
                                </div>

                                <span className="step-counter">{step + 1} / {sidebarItems.length}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;




