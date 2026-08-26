import { useState } from 'react'
import QuickAdd from '../components/QuickAdd'
import './Vault.css'

function Vault() {
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState(null)

  function handleAddIdea(newIdea) {
    setIdeas((currentIdeas) => [...currentIdeas, newIdea])
    setShowForm(false)
  }

  function handleDeleteIdea(id) {
    setIdeas((currentIdeas) =>
      currentIdeas.filter((idea) => idea.id !== id)
    )

    setSelectedIdea(null)
  }

  function handleStatusChange(id, status) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === id
          ? { ...idea, status }
          : idea
      )
    )

    if (selectedIdea?.id === id) {
      setSelectedIdea((currentIdea) => ({
        ...currentIdea,
        status
      }))
    }
  }

  function handleCardClick(idea) {
    setSelectedIdea(idea)
  }

  function closeDetails() {
    setSelectedIdea(null)
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

      <div className="idea-grid">
        {ideas.map((idea) => (
          <article
            className="vault-idea-card"
            key={idea.id}
            style={{
              backgroundColor: idea.iconColor || '#fff8e7'
            }}
            onClick={() => handleCardClick(idea)}
          >
            <div className="vault-card-content">
              <h2>{idea.title}</h2>

              <p>
                {idea.description.length > 20
                  ? `${idea.description.slice(0, 20)}...`
                  : idea.description}
              </p>
            </div>

            <div className="vault-card-footer">
              <span>
                {idea.isPublic ? 'Public' : 'Private'}
              </span>

              <select
                value={idea.status}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) =>
                  handleStatusChange(
                    idea.id,
                    event.target.value
                  )
                }
              >
                <option value="Thinking">Thinking</option>
                <option value="Building">Building</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </article>
        ))}
      </div>

      {selectedIdea && (
        <div
          className="idea-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="idea-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeDetails}
              aria-label="Close idea details"
            >
              ×
            </button>

            <div className="modal-header">
              <span className="modal-privacy">
                {selectedIdea.isPublic ? 'Public' : 'Private'}
              </span>

              <h2>{selectedIdea.title}</h2>

              <p>{selectedIdea.description}</p>
            </div>

            <div className="modal-section">
              <div className="section-heading">
                <h3>Roadmap</h3>

                <button className="add-task-button">
                  + Add Task
                </button>
              </div>

              <div className="empty-state">
                <p>No roadmap tasks yet.</p>
              </div>
            </div>

            {selectedIdea.isPublic && (
              <div className="modal-section">
                <h3>Feedback</h3>

                <div className="empty-state">
                  <p>No feedback yet.</p>
                </div>
              </div>
            )}

            <button
              className="modal-delete-button"
              onClick={() => handleDeleteIdea(selectedIdea.id)}
              aria-label="Delete idea"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Vault