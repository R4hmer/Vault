import { useEffect, useState } from 'react'
import Comments from './Comments'

const API_URL = import.meta.env.VITE_API_URL
const CURRENT_USER_ID = 1

function IdeaCard({ idea }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(
      `${API_URL}/ideas/${idea.id}/engagement?user_id=${CURRENT_USER_ID}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load engagement')
        }

        return response.json()
      })
      .then((data) => {
        setLikes(data.likes_count)
        setIsLiked(data.is_liked)
        setIsFavourite(data.is_favourited)
      })
      .catch(() => {})
  }, [idea.id])

  async function handleLike() {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/ideas/${idea.id}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: CURRENT_USER_ID
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      setIsLiked(!isLiked)
      setLikes((current) =>
        isLiked ? current - 1 : current + 1
      )
    } catch {
      alert('Unable to update like.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFavourite() {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/ideas/${idea.id}/favourite`,
        {
          method: isFavourite ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: CURRENT_USER_ID
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update favourite')
      }

      setIsFavourite(!isFavourite)
    } catch {
      alert('Unable to update favourite.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <article className="idea-card">
        <div className="idea-card-content">
          <span className="idea-category">
            {idea.category}
          </span>

          <h2>{idea.title}</h2>

          <p>{idea.description}</p>

          <div className="idea-card-meta">
            <button
              className="posted-by"
              type="button"
            >
              Posted by {idea.postedBy || `User ${idea.user_id}`}
            </button>

            <button
              className="comment-count"
              onClick={() => setShowComments(true)}
              type="button"
            >
              Comments
            </button>
          </div>
        </div>

        <div className="idea-card-actions">
          <button
            type="button"
            onClick={handleLike}
            aria-label="Like idea"
            disabled={loading}
          >
            {isLiked ? '👍' : '👍'} {likes}
          </button>


          <button
            type="button"
            onClick={handleFavourite}
            aria-label="Favourite idea"
            disabled={loading}
          >
            {isFavourite ? '♥' : '♡'}
          </button>
        </div>
      </article>

      {showComments && (
        <Comments
          ideaId={idea.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  )
}

export default IdeaCard