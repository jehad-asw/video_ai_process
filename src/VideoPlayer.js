import React, {useEffect, useState} from "react";
import axios from "axios";

const video_url = "http://localhost:8000/videos/"

function VideoPlayer() {
    const [videos, setVideos] = useState([]);
    const [videoData, setVideoData] = useState({});
    useEffect(() => {
        axios.get(video_url)
            .then((response) => {
                setVideos(response.data.videos);
                response.data.videos.forEach(fetchVideoData);
            })
            .catch((error) => {
                console.error("Error fetching videos list", error);
            });

    }, []);

    //fetch video data from backend
    const fetchVideoData = async (video) => {
        const videoName = video.replace(".mp4", "");
        try {
            const response = await axios.get(`${video_url}${videoName}/metadata`);
            setVideoData((prevData) => ({
                ...prevData,
                [videoName]: response.data.key_moments,
            }));
        } catch (error) {
            console.error("Error fetching video metadata:", error);
        }
    };

    //handle delete video
    const deleteVideo = (filename) => {
        axios.delete(`http://localhost:8000/videos/${filename}`)
            .then(() => {
                setVideos(videos.filter(video => video !== filename));
            })
            .catch(error => console.error("Error deleting video:", error));
    };


    return (
        <div style={{maxWidth: "600px", margin: "0 auto"}}>
            <h2>Uploaded Videos</h2>
            {videos.length === 0 ? (
                <p>No videos uploaded yet.</p>
            ) : (
                <div>
                    {videos.map((video, index) => {
                        const videoName = video.replace(".mp4", "");
                        return (
                            <div
                                key={index}
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#f9f9f9",
                                    textAlign: "center"
                                }}
                            >

                                <h3 style={{marginBottom: "10px", color: "#333"}}>{video}</h3>
                                <video width="100%" controls style={{borderRadius: "10px"}}>
                                    <source src={`http://127.0.0.1:8000/videos/${video}`}/>
                                    Your browser does not support this video format.
                                </video>
                                <div
                                    style={{marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px"}}>
                                    <button
                                        onClick={() => deleteVideo(video)}
                                        style={{
                                            background: "#ff4d4d",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 15px",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            fontSize: "14px",
                                            transition: "0.3s",
                                        }}
                                        onMouseOver={(e) => e.target.style.background = "#cc0000"}
                                        onMouseOut={(e) => e.target.style.background = "#ff4d4d"}
                                    >
                                        ❌ Delete
                                    </button>

                                    <button
                                        onClick={() => fetchVideoData(video)}
                                        style={{
                                            background: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 15px",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            fontSize: "14px",
                                            transition: "0.3s",
                                        }}
                                    >
                                        ℹ️ Show Info
                                    </button>
                                </div>

                                {videoData[videoName] && (
                                    <div style={{
                                        marginTop: "10px",
                                        background: "#f4f4f4",
                                        padding: "10px",
                                        borderRadius: "5px"
                                    }}>
                                        <h4>Key Moments:</h4>
                                        <ul>
                                            {videoData[videoName].map((moment, idx) => (
                                                <li key={idx}>
                                                    <strong>{moment.time}</strong>: {moment.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>

                        );
                    })}
                </div>
            )}
        </div>
    );

}

export default VideoPlayer;
