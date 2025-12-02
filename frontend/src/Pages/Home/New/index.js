import {FiUploadCloud} from "react-icons/fi";
import React, {useState} from "react";
import axios from "axios";

const NewChat = ({ setData, setPopup, setImagePreviews }) => {

    const [ step, setStep ] = useState(0);
    const [ uploading, setUploading ] = useState(false);
    const [ frontImage, setFrontImage ] = useState( null );
    const [ sideImage, setSideImage ] = useState( null );
    const [ name, setName ] = useState( null );

    const handleFrontImageSelect = async (e) => {
        const files = e.target.files;

        // No file selected
        if (!files || files.length === 0) return;

        // You’re not using multiple, so just grab the first file
        const file = files[0];

        console.log(file);
        console.log(file.type);

        // Allow only PNG and JPG/JPEG
        const allowedTypes = ["image/png", "image/jpeg"];

        if (!allowedTypes.includes(file.type)) {
            // You can replace alert with your own UI error state
            alert("Please select a PNG or JPG image.");
            return;
        }

        const url = await uploadToCloudinary( file );

        // If you actually want to store the selected file:
        setFrontImage( url || URL.createObjectURL ( file ) );

    };

    const handleSideImageSelect = async (e) => {
        const files = e?.target?.files;

        // No file selected
        if (!files || files.length === 0) return;

        // You’re not using multiple, so just grab the first file
        const file = files[0];

        console.log(file);
        console.log(file.type);

        // Allow only PNG and JPG/JPEG
        const allowedTypes = ["image/png", "image/jpeg"];

        if (!allowedTypes.includes(file.type)) {
            // You can replace alert with your own UI error state
            alert("Please select a PNG or JPG image.");
            return;
        }

        const url = await uploadToCloudinary( file );

        // If you actually want to store the selected file:
        setSideImage( url || URL.createObjectURL ( file ) );

    };

    const submit = () => {

        setData({ frontImage: frontImage, sideImage: sideImage, name: name });
        setImagePreviews([ frontImage, sideImage ]);

        setPopup( false );

    }

    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const uploadToCloudinary = async ( file ) => {

        const formData = new FormData();

        formData.append( "file", file );
        formData.append( "upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "" );
        formData.append( "cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "" );

        try {

            setUploading(true);

            const res = await axios.post(cloudinaryUploadUrl, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            setUploading(false);

            return res.data.secure_url;

        } catch ( err ) {
            console.error("❌ Încărcarea pe Cloudinary a eșuat:", err.message);
            setUploading(false);
            return null;
        }
    };

    return (
        <div className={ 'newChatPopup' }>
            <div className={ 'popupBody' }>
                {
                    step === 0 ?
                        <>
                            <h3 style={{ fontSize: '18px' }}> Person Front Image </h3>
                            {
                                frontImage ?
                                    <>
                                        <img src={frontImage} alt={ 'Front Image' } style={{ maxWidth: '500px', maxHeight: '400px', borderRadius: '2px' }} />
                                        <button className={'confirm-btn'} style={{ background: '#083A5E', marginTop: '10px' }} onClick={ () => setStep( 1 ) }> Proceed </button>
                                        <button className={'confirm-btn'} style={{ marginTop: '10px' }} onClick={ () => setFrontImage( null ) }> Reset </button>
                                    </> :
                                    <>
                                        <div className="drop-zone-inner">
                                            <label htmlFor="frontImage" className="browse-link">
                                                <FiUploadCloud className="upload-icon"/>
                                                <h4>{uploading ? "Se încarcă..." : "Trage și plasează sau selectează fișierul"}</h4>
                                                <p>Trage fișierele aici sau fă clic pentru a răsfoi</p>
                                            </label>
                                        </div>
                                        <input
                                            id="frontImage"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={ handleFrontImageSelect }
                                            className="file-input"
                                        />
                                    </>
                            }
                        </> : <></>

                }
                {
                    step === 1 ?
                        <>
                            <h3 style={{ fontSize: '18px' }}> Person Side Image </h3>
                            {
                                sideImage ?
                                    <>
                                        <img src={sideImage} alt={ 'Front Image' } style={{ maxWidth: '500px', maxHeight: '400px', borderRadius: '2px' }} />
                                        <button className={'confirm-btn'} style={{ background: '#083A5E', marginTop: '10px' }} onClick={ () => setStep( 2 ) }> Proceed </button>
                                        <button className={'confirm-btn'} style={{ marginTop: '10px' }} onClick={ () => setSideImage( null ) }> Reset </button>
                                    </> :
                                    <>
                                        <div className="drop-zone-inner">
                                            <label htmlFor="sideImage" className="browse-link">
                                                <FiUploadCloud className="upload-icon"/>
                                                <h4>{uploading ? "Se încarcă..." : "Trage și plasează sau selectează fișierul"}</h4>
                                                <p>Trage fișierele aici sau fă clic pentru a răsfoi</p>
                                            </label>
                                        </div>
                                        <input
                                            id="sideImage"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={ handleSideImageSelect }
                                            className="file-input"
                                        />
                                    </>
                            }
                        </> : <></>

                }
                {
                    step === 2 ?
                        <>
                            <h3 style={{ fontSize: '18px' }}> Person Details </h3>
                            <label htmlFor="fileInput" className="browse-link" style={{ color: '#083A5E' }}> Person Name </label>
                            <input type={ 'text' } onChange={ (e) => { setName( e.target.value ) }} style={{ border: '1px solid rgba( 0, 0, 0, 0.75 )', borderRadius: '2px' }} />
                            <button className={'confirm-btn'} style={{ background: '#083A5E', marginTop: '10px' }} onClick={ () => submit() }> Analyze </button>

                        </> : <></>

                }
                {/*<div>
                    <label> Name your person </label>
                    <input type={'text'} />
                </div>*/}
            </div>
            <div style={{ position: 'absolute', right: '20px', top: '20px', cursor: 'pointer', backgroundColor: '#fff' }} onClick={ () => setPopup( false ) }>
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"></path>
                </svg>
            </div>
        </div>
    );

}

export default NewChat;