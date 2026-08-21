import { useState } from 'react'

function IdeaCard({ idea }) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [isFavourite, setIsFavourite] = useState(false)

  return (
    <article className="idea-card">
      <div className="idea-card-content">
        <span className="idea-category">{idea.category}</span>
        <h2>{idea.title}</h2>
        <p>{idea.description}</p>
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