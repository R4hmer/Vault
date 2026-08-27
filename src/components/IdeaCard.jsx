import { useState } from 'react'
import Comments from './Comments'

function IdeaCard({ idea }) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [isFavourite, setIsFavourite] = useState(false)
  const [showComments, setShowComments] = useState(false)

  function handlePostedByClick(event) {
    event.stopPropagation()
  }

  function handleCommentsClick() {
    setShowComments(true)
  }

  function handleCloseComments() {
    setShowComments(false)
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
              onClick={handlePostedByClick}
              type="button"
            >
              Posted by {idea.postedBy}
            </button>

            <button
              className="comment-count"
              onClick={handleCommentsClick}
              type="button"
            >
              Comments
            </button>
          </div>
        </div>

        <div className="idea-card-actions">
          <button
            type="button"
            onClick={() => setLikes(likes + 1)}
            aria-label="Like idea"
          >
            👍 {likes}
          </button>

          <button
            type="button"
            onClick={() => setDislikes(dislikes + 1)}
            aria-label="Dislike idea"
          >
            👎 {dislikes}
          </button>

          <button
            type="button"
            onClick={() => setIsFavourite(!isFavourite)}
            aria-label="Favourite idea"
          >
            {isFavourite ? '♥' : '♡'}
          </button>
        </div>
      </article>

      {showComments && (
        <Comments onClose={handleCloseComments} />
      )}
    </>
  )
}

export default IdeaCard

