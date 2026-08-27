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

  return (
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
          >
            Posted by {idea.postedBy}
          </button>

          <button
            className="comment-count"
            onClick={() => setShowComments(!showComments)}
          >
            Comments
          </button>
        </div>

        {showComments && <Comments />}
      </div>

      <div className="idea-card-actions">
        <button onClick={() => setLikes(likes + 1)}>
          👍 {likes}
        </button>

        <button onClick={() => setDislikes(dislikes + 1)}>
          👎 {dislikes}
        </button>

        <button
          onClick={() => setIsFavourite(!isFavourite)}
        >
          {isFavourite ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}

export default IdeaCard