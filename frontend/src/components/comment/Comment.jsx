import axios from "axios";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CommentCard } from "..";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Comment({ tweetId, videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  
  const url = tweetId
    ? `http://127.0.0.1:8000/api/v1/comments/tweet/${tweetId}`
    : `http://127.0.0.1:8000/api/v1/comments/video/${videoId}`;

  const fetchComments = async () => {
    try {
      const response = await axios.get(url);
      setComments(response.data.data);
    } catch (error) {
      console.log("Comment fetch error :: ", error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        url,
        { content: newComment },
        { withCredentials: true }
      );
      setComments([...comments, response.data.data]);
      setNewComment("");
    } catch (error) {
      console.log("Add comment error :: ", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newComment]);

  return (
    <div>
      <h2 className="lg:text-xl sm:text-lg text-base">Comments</h2>
      <form className="grid w-full gap-2 my-4" onSubmit={addComment}>
        <Textarea
          placeholder="Type your message here."
          className="bg-transparent"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
          onClick={() => {
            if (!authStatus) {
              navigate("/auth/login");
            }
          }}
        >
          {authStatus ? "Add comment" : "Login to comment"}
        </Button>
      </form>
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <div className="mb-3" key={comment?._id}>
              <CommentCard comment={comment} />
            </div>
          ))}
        </ul>
      ) : (
        <h2>No comments!!!</h2>
      )}
    </div>
  );
}

export default Comment;
