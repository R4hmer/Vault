import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import IdeaCard from '../components/IdeaCard'
import './Explore.css'

const API_URL = import.meta.env.VITE_API_URL

function Explore() {
  const [ideas, setIdeas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/ideas`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch ideas')
        }

        return response.json()
      })
      .then((data) => {
        const publicIdeas = data
          .filter(
            (idea) => idea.privacy === 'public'
          )
          .map((idea) => ({
            ...idea,
            postedBy: `User ${idea.user_id}`
          }))

        setIdeas(publicIdeas)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load ideas.')
        setLoading(false)
      })
  }, [])

  const filteredIdeas = ideas.filter((idea) =>
    `${idea.title} ${idea.description} ${idea.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <main className="explore-page">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      {loading && <p>Loading ideas...</p>}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        filteredIdeas.length === 0 && (
          <p>
            Oops, we don't seem to have that right
            now.
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