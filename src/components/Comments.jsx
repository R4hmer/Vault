import { useState } from 'react'

function Comments() {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      likes: 0,
      liked: false
    }

    setComments((currentComments) => [
      ...currentComments,
      newComment
    ])

    setCommentText('')
  }

  function handleLike(commentId) {
    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.liked
                ? comment.likes - 1
                : comment.likes + 1,
              liked: !comment.liked
            }
          : comment
      )
    )
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      <form
        className="comment-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={commentText}
          onChange={(event) =>
            setCommentText(event.target.value)
          }
          placeholder="Leave a comment..."
        />

        <button type="submit">
          Post
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div
            className="comment"
            key={comment.id}
          >
            <p>{comment.text}</p>

            <button
              className={`comment-like ${
                comment.liked ? 'liked' : ''
              }`}
              onClick={() => handleLike(comment.id)}
              aria-label="Like comment"
            >
              ♥ {comment.likes}
            </button>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="no-comments">
            No comments yet.
          </p>
        )}
      </div>
    </div>
  )
}

export default Comments