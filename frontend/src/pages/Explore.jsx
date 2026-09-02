import { useEffect, useState } from 'react'
import IdeaCard from '../components/IdeaCard'
import SearchBar from '../components/SearchBar'
import './Explore.css'

const API_URL = import.meta.env.VITE_API_URL

function Explore() {
const [ideas, setIdeas] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
loadIdeas()
}, [])

async function loadIdeas() {
try {
setLoading(true)
setError('')


  const response = await fetch(
    `${API_URL}/ideas`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to load ideas'
    )
  }

  const publicIdeas = data
    .filter(
      (idea) =>
        idea.privacy === 'public'
    )
    .map((idea) => ({
      ...idea,
      postedByUsername:
        idea.username ||
        idea.postedBy ||
        `User ${idea.user_id}`
    }))

  setIdeas(publicIdeas)
} catch (error) {
  setError(
    error.message ||
      'Unable to load ideas.'
  )
} finally {
  setLoading(false)
}


}

const filteredIdeas = ideas.filter(
(idea) =>
`${idea.title} ${idea.description} ${idea.category} ${idea.postedByUsername}`
.toLowerCase()
.includes(
searchTerm.toLowerCase()
)
)

return ( <main className="explore-page"> <SearchBar
     searchTerm={searchTerm}
     onSearch={setSearchTerm}
   />


  {loading && (
    <p>Loading ideas...</p>
  )}

  {error && (
    <p>{error}</p>
  )}

  {!loading &&
    !error &&
    filteredIdeas.length === 0 && (
      <p>
        Oops, we don't seem to have that
        right now.
      </p>
    )}

  {!loading &&
    !error &&
    filteredIdeas.length > 0 && (
      <div className="idea-grid">
        {filteredIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
          />
        ))}
      </div>
    )}
</main>


)
}

export default Explore
