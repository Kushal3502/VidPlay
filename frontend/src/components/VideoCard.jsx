import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ data }) {
  console.log(data);
  return (
    <div>
      <Link to={`video/${data._id}`}>
        <img src={data.thumbnail} className=" rounded-lg" />
        <p>{data.title}</p>
      </Link>
    </div>
  );
}

export default VideoCard;
