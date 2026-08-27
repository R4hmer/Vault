import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import IdeaCard from '../components/IdeaCard'
import './Explore.css'

function Explore() {
  const [ideas, setIdeas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch ideas')
        }

        return response.json()
      })
      .then((data) => {
        const formattedIdeas = data.products.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          postedBy: 'Vault Community'
        }))

        setIdeas(formattedIdeas)
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
      <h1>EXPLORE</h1>

      <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      {loading && <p>Loading ideas...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && filteredIdeas.length === 0 && (
        <p>Oops, we don't seem to have that right now.</p>
      )}

      {!loading && !error && filteredIdeas.length > 0 && (
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