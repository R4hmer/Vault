import { useState } from 'react'

function Comments({ onClose }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'Amina',
      text: 'This is actually a really interesting idea.',
      likes: 3,
      liked: false
    },
    {
      id: 2,
      username: 'Sam',
      text: 'I could definitely see this being developed further.',
      likes: 1,
      liked: false
    }
  ])

  const [commentText, setCommentText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    const newComment = {
      id: Date.now(),
      username: 'You',
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
    <div className="comments-overlay" onClick={onClose}>
      <div
        className="comments-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="comments-header">
          <h2>Comments</h2>

          <button
            className="comments-close"
            onClick={onClose}
            type="button"
            aria-label="Close comments"
          >
            ×
          </button>
        </div>

        <div className="comments-list">
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="comment-content">
                <strong>{comment.username}</strong>
                <p>{comment.text}</p>
              </div>

              <button
                className={`comment-like ${
                  comment.liked ? 'liked' : ''
                }`}
                onClick={() => handleLike(comment.id)}
                type="button"
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
      </div>
    </div>
  )
}

export default Comments

