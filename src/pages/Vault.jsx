import { useState } from 'react'
import QuickAdd from '../components/QuickAdd'
import './Vault.css'

function Vault() {
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] = useState(false)

  function handleAddIdea(newIdea) {
    setIdeas((currentIdeas) => [...currentIdeas, newIdea])
    setShowForm(false)
  }

  function handleDeleteIdea(id) {
    setIdeas((currentIdeas) =>
      currentIdeas.filter((idea) => idea.id !== id)
    )
  }

  return (
    <main className="vault-page">
      <div className="vault-header">
        <h1>𝕐𝕆𝕌ℝ 𝕀𝔻𝔼𝔸𝕊</h1>

        <button onClick={() => setShowForm(!showForm)}>
          Quick Add
        </button>
      </div>

      {showForm && <QuickAdd onAddIdea={handleAddIdea} />}

      <div className="idea-list">
        <div className="idea-row idea-heading">
          <span>Idea</span>
          <span>Category</span>
          <span>Status</span>
        </div>

        {ideas.map((idea) => (
          <div className="idea-row" key={idea.id}>
            <span>{idea.title}</span>
            <span>{idea.category}</span>

            <div className="idea-actions">
              <select
                value={idea.status}
                onChange={(event) => {
                  const updatedIdeas = ideas.map((currentIdea) =>
                    currentIdea.id === idea.id
                      ? { ...currentIdea, status: event.target.value }
                      : currentIdea
                  )

                  setIdeas(updatedIdeas)
                }}
              >
                <option value="Thinking">Thinking</option>
                <option value="Building">Building</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                className="delete-button"
                onClick={() => handleDeleteIdea(idea.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Vault