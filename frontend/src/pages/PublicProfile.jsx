import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IdeaCard from '../components/IdeaCard'
import './Profile.css'

const API_URL = import.meta.env.VITE_API_URL

function PublicProfile() {
  const { userId } = useParams()

  const [user, setUser] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] =
    useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [userId])

  async function loadProfile() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/public-ideas`
      )

      if (!response.ok) {
        throw new Error(
          'Unable to load public profile.'
        )
      }

      const data = await response.json()

      setIdeas(data)

      if (data.length > 0) {
        setUser({
          id: data[0].user_id,
          username:
            data[0].username ||
            `User ${data[0].user_id}`
        })
      } else {
        setUser({
          id: userId,
          username: `User ${userId}`
        })
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div>

          <p>
            @{user?.username}
          </p>
        </div>
      </section>

      {loading && (
        <p>Loading profile...</p>
      )}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        ideas.length === 0 && (
          <section className="profile-ideas">
            <h2>PUBLIC IDEAS</h2>

            <div className="profile-empty">
              <p>
                This user has no public ideas
                yet.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        ideas.length > 0 && (
          <section className="profile-ideas">
            <h2>PUBLIC IDEAS</h2>

            <div className="idea-grid">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={{
                    ...idea,
                    postedByUsername:
                      user?.username
                  }}
                />
              ))}
            </div>
          </section>
        )}
    </main>
  )
}

export default PublicProfile