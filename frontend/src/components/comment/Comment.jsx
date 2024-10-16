import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CommentCard } from "..";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { get, post } from "@/utils/api";

function Comment({ tweetId, videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const { toast } = useToast();

  const url = tweetId
    ? `/comments/tweet/${tweetId}`
    : `/comments/video/${videoId}`;

  const fetchComments = async () => {
    const response = await get(url, {}, false);
    console.log(response.data);
    setComments(response.data);
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const response = await post(url, { content: newComment });
    console.log(response);

    toast({
      description: "🟢 Comment added!!!",
      className:
        "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
    });
    setComments([...comments, response.data]);
    setNewComment("");
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
