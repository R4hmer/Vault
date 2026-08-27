import { useState } from 'react'
import QuickAdd from '../components/QuickAdd'
import IdeaDetails from '../components/IdeaDetails'
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

  function handleAddTask(ideaId, task) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              tasks: [
                ...(idea.tasks || []),
                {
                  id: Date.now(),
                  title: task
                }
              ]
            }
          : idea
      )
    )

    setSelectedIdea((currentIdea) => ({
      ...currentIdea,
      tasks: [
        ...(currentIdea.tasks || []),
        {
          id: Date.now(),
          title: task
        }
      ]
    }))
  }

  function handleDeleteTask(ideaId, taskId) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              tasks: (idea.tasks || []).filter(
                (task) => task.id !== taskId
              )
            }
          : idea
      )
    )

    setSelectedIdea((currentIdea) => ({
      ...currentIdea,
      tasks: (currentIdea.tasks || []).filter(
        (task) => task.id !== taskId
      )
    }))
  }

  function handleEditTask(ideaId, taskId, newTitle) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              tasks: (idea.tasks || []).map((task) =>
                task.id === taskId
                  ? { ...task, title: newTitle }
                  : task
              )
            }
          : idea
      )
    )

    setSelectedIdea((currentIdea) => ({
      ...currentIdea,
      tasks: (currentIdea.tasks || []).map((task) =>
        task.id === taskId
          ? { ...task, title: newTitle }
          : task
      )
    }))
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
        <IdeaDetails
          idea={selectedIdea}
          onClose={closeDetails}
          onDeleteIdea={handleDeleteIdea}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </main>
  )
}

export default Vault