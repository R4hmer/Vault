import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function Comments({ ideaId, onClose }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const savedUser = localStorage.getItem('currentUser')
  const currentUser = savedUser
    ? JSON.parse(savedUser)
    : null

  const currentUserId = currentUser?.id

  useEffect(() => {
    loadComments()
  }, [ideaId, currentUserId])

  async function loadComments() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/comments`
      )

      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()

      const ideaComments = data.filter(
        (comment) => comment.idea_id === ideaId
      )

      const commentsWithLikes =
        await Promise.all(
          ideaComments.map(async (comment) => {
            try {
              const likesResponse =
                await fetch(
                  `${API_URL}/ideas/${ideaId}/comments/${comment.id}/engagement?user_id=${currentUserId || ''}`
                )

              if (!likesResponse.ok) {
                return {
                  ...comment,
                  likes: 0,
                  liked: false
                }
              }

              const likesData =
                await likesResponse.json()

              return {
                ...comment,
                likes: likesData.likes_count,
                liked: likesData.is_liked
              }
            } catch {
              return {
                ...comment,
                likes: 0,
                liked: false
              }
            }
          })
        )

      setComments(commentsWithLikes)
    } catch {
      setError('Unable to load comments.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    if (!currentUserId) {
      setError(
        'You must be logged in to comment.'
      )
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: commentText.trim(),
            user_id: currentUserId,
            idea_id: ideaId
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      setCommentText('')
      await loadComments()
    } catch {
      setError('Unable to post comment.')
    }
  }

  async function handleLike(
    commentId,
    liked
  ) {
    if (!currentUserId) {
      setError(
        'You must be logged in to like comments.'
      )
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/ideas/${ideaId}/comments/${commentId}/like`,
        {
          method: liked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: currentUserId
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to update comment like'
        )
      }

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                liked: !liked,
                likes: liked
                  ? comment.likes - 1
                  : comment.likes + 1
              }
            : comment
        )
      )
    } catch {
      setError(
        'Unable to update comment like.'
      )
    }
  }

  return (
    <div
      className="comments-overlay"
      onClick={onClose}
    >
      <div
        className="comments-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
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

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <div className="comments-list">
          {loading && (
            <p>Loading comments...</p>
          )}

          {!loading &&
            comments.map((comment) => (
              <div
                className="comment"
                key={comment.id}
              >
                <div className="comment-content">
                  <strong>
                    {comment.username ||
                      `User ${comment.user_id}`}
                  </strong>

                  <p>{comment.text}</p>
                </div>

                <button
                  className={`comment-like ${
                    comment.liked
                      ? 'liked'
                      : ''
                  }`}
                  onClick={() =>
                    handleLike(
                      comment.id,
                      comment.liked
                    )
                  }
                  type="button"
                  aria-label="Like comment"
                  disabled={!currentUserId}
                >
                  ♥ {comment.likes}
                </button>
              </div>
            ))}

          {!loading &&
            comments.length === 0 && (
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
              setCommentText(
                event.target.value
              )
            }
            placeholder="Leave a comment..."
            disabled={!currentUserId}
          />

          <button
            type="submit"
            disabled={!currentUserId}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default Comments
