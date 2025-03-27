import React, {useState} from "react";
import axios from "axios";

const upload_url ="http://127.0.0.1:8000/upload/"

function Upload(){
    const[ file, setFile]= useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    };

    const handleUpload = async () => {
        if(!file) return alert("Select a file first!");
        let formData = new FormData();
        formData.append("file",file);

        try{
            const response = await axios.post(upload_url,formData);
            alert(`Uploaded: ${response.data.filename}`);
        }catch (error){
            console.error("Upload failed:", error);
        }
    };
    return(
        <div>
            <h1>Upload a video</h1>
            <input type="file" onChange={handleFileChange}></input>
            <button onClick={handleUpload}> Upload File</button>
        </div>
    );
}
export default Upload;
