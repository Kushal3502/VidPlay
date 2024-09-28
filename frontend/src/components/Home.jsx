import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/videos", { credentials: 'include' })
      .then((res) => {
        console.log(res.data);
        setVideos(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {videos && (
        <ul>
          {videos.map((video) => (
            <li>{video.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
