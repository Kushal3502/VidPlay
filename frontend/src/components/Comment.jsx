import React from 'react'

function Comment() {
  return (
    <div>
          <h2 className="lg:text-xl sm:text-lg text-base">Comments</h2>
          <div className="grid w-full gap-2 my-4">
            <Textarea
              placeholder="Type your message here."
              className=" bg-transparent"
            />
            <Button className=" bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base">
              Add Comment
            </Button>
          </div>
          {comments && comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <div className="mb-6" key={comment?._id}>
                  <CommentCard comment={comment} />
                </div>
              ))}
            </ul>
          ) : (
            <h2>No comments!!!</h2>
          )}
        </div>
  )
}

export default Comment