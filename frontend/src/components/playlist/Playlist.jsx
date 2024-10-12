import React, { useEffect, useState } from "react";
import { PlaylistCard } from "..";
import axios from "axios";

function Playlist({ userId }) {
  const [playlist, setPlaylist] = useState();

  const fetchUserPlaylists = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/playlist/user/${userId}`,
        { withCredentials: true }
      );
      setPlaylist(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("Playlist fetch error :: ", error);
    }
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <div>
      {playlist && playlist.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-3">
          {playlist.map((item) => (
            <div
              key={item._id}
              className=" rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <PlaylistCard playlist={item} />
            </div>
          ))}
        </div>
      ) : (
        <p>No playlist available</p>
      )}
    </div>
  );
}

export default Playlist;
