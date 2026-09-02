import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Comments from './Comments'

const API_URL = import.meta.env.VITE_API_URL

function getCurrentUser() {
const savedUser = localStorage.getItem('currentUser')

if (!savedUser) {
return null
}

try {
return JSON.parse(savedUser)
} catch {
return null
}
}

function IdeaCard({ idea }) {
const navigate = useNavigate()

const currentUser = getCurrentUser()
const currentUserId = currentUser?.id

const [likes, setLikes] = useState(
idea.likes_count || 0
)

const [isLiked, setIsLiked] = useState(false)

const [favourites, setFavourites] = useState(
idea.favourites_count || 0
)

const [isFavourite, setIsFavourite] = useState(false)

const [commentsCount, setCommentsCount] = useState(
idea.comments_count || 0
)

const [showComments, setShowComments] = useState(false)
const [loading, setLoading] = useState(false)

useEffect(() => {
setLikes(idea.likes_count || 0)
setFavourites(idea.favourites_count || 0)
setCommentsCount(idea.comments_count || 0)
}, [
idea.id,
idea.likes_count,
idea.favourites_count,
idea.comments_count
])

useEffect(() => {
if (!currentUserId) {
setIsLiked(false)
setIsFavourite(false)
return
}


async function loadEngagement() {
  try {
    const response = await fetch(
      `${API_URL}/ideas/${idea.id}/engagement?user_id=${currentUserId}`
    )

    if (!response.ok) {
      return
    }

    const data = await response.json()

    setLikes(data.likes_count || 0)
    setIsLiked(Boolean(data.is_liked))

    setFavourites(
      data.favourites_count || 0
    )

    setIsFavourite(
      Boolean(data.is_favourited)
    )
  } catch {
    // Keep the card usable if engagement fails.
  }
}

loadEngagement()


}, [idea.id, currentUserId])

async function handleLike(event) {
event.stopPropagation()


if (!currentUserId || loading) {
  return
}

setLoading(true)

try {
  const response = await fetch(
    `${API_URL}/ideas/${idea.id}/like`,
    {
      method: isLiked
        ? 'DELETE'
        : 'POST',
      headers: {
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        user_id: currentUserId
      })
    }
  )

  const data =
    await response
      .json()
      .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Failed to update like'
    )
  }

  const nextLiked = !isLiked

  setIsLiked(nextLiked)

  setLikes((current) =>
    nextLiked
      ? current + 1
      : Math.max(0, current - 1)
  )
} catch {
  alert('Unable to update like.')
} finally {
  setLoading(false)
}


}

async function handleFavourite(event) {
event.stopPropagation()


if (!currentUserId || loading) {
  return
}

setLoading(true)

try {
  const response = await fetch(
    `${API_URL}/ideas/${idea.id}/favourite`,
    {
      method: isFavourite
        ? 'DELETE'
        : 'POST',
      headers: {
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        user_id: currentUserId
      })
    }
  )

  const data =
    await response
      .json()
      .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Failed to update favourite'
    )
  }

  const nextFavourite =
    !isFavourite

  setIsFavourite(nextFavourite)

  setFavourites((current) =>
    nextFavourite
      ? current + 1
      : Math.max(0, current - 1)
  )
} catch {
  alert('Unable to update favourite.')
} finally {
  setLoading(false)
}


}

function handleComments(event) {
event.stopPropagation()
setShowComments(true)
}

function handlePostedBy(event) {
event.stopPropagation()


if (idea.user_id) {
  navigate(
    `/users/${idea.user_id}`
  )
}


}

const cardColor =
idea.icon_color ||
idea.iconColor ||
'#FFF8E7'

return (
<>
<article
className="idea-card"
style={{
backgroundColor: cardColor
}}
> <div className="idea-card-content"> <span className="idea-category">
{idea.category} </span>


      <h2>{idea.title}</h2>

      <p>{idea.description}</p>

      <div className="idea-card-meta">
        <button
          className="posted-by"
          type="button"
          onClick={handlePostedBy}
        >
          Posted by @
          {idea.postedByUsername ||
            `User ${idea.user_id}`}
        </button>

        <button
          className="comment-count"
          type="button"
          onClick={handleComments}
        >
          💬 {commentsCount}
        </button>
      </div>
    </div>

    <div className="idea-card-actions">
      <button
        type="button"
        onClick={handleLike}
        aria-label="Like idea"
        disabled={
          loading ||
          !currentUserId
        }
      >
        {isLiked ? '♥' : '♡'} {likes}
      </button>

      <button
        type="button"
        onClick={handleFavourite}
        aria-label="Favourite idea"
        disabled={
          loading ||
          !currentUserId
        }
      >
        {isFavourite
          ? '★'
          : '☆'}{' '}
        {favourites}
      </button>
    </div>
  </article>

  {showComments && (
    <Comments
      ideaId={idea.id}
      onCommentsCountChange={
        setCommentsCount
      }
      onClose={() =>
        setShowComments(false)
      }
    />
  )}
</>


)
}

export default IdeaCard
