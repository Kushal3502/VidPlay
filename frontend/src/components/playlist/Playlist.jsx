import React, { useEffect, useState } from "react";
import { PlaylistCard } from "..";
import { get } from "@/utils/api";

function Playlist({ userId }) {
  const [playlist, setPlaylist] = useState();

  const fetchUserPlaylists = async () => {
    const response = await get(`/playlist/user/${userId}`);
    console.log(response.data);
    setPlaylist(response.data);
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <div>
      {playlist && playlist.length > 0 ? (
        <div className="grid lg:grid-cols-4 sm:grid-col-2 grid-col-1 gap-3">
          {playlist.map((item) => (
            <div key={item._id} className=" rounded-lg cursor-pointer">
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
