import { useEffect, useState } from 'react'
import QuickAdd from '../components/QuickAdd'
import IdeaDetails from '../components/IdeaDetails'
import './Vault.css'

const API_URL = import.meta.env.VITE_API_URL

function getCurrentUser() {
  const savedUser =
    localStorage.getItem('currentUser')

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    return null
  }
}

function Vault() {
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] =
    useState(false)
  const [selectedIdea, setSelectedIdea] =
    useState(null)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] = useState('')

  const currentUser = getCurrentUser()
  const currentUserId = currentUser?.id

  useEffect(() => {
    loadIdeas()
  }, [currentUserId])

  async function loadIdeas() {
    setLoading(true)
    setError('')

    if (!currentUserId) {
      setIdeas([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/ideas`
      )

      if (!response.ok) {
        throw new Error(
          'Failed to load your ideas'
        )
      }

      const data = await response.json()

      const userIdeas = data.map(
        (idea) => ({
          ...idea,
          isPublic:
            idea.privacy === 'public',
          iconColor:
            idea.iconColor ||
            '#fff8e7'
        })
      )

      setIdeas(userIdeas)
    } catch {
      setError(
        'Unable to load your ideas.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleAddIdea(newIdea) {
    setIdeas((currentIdeas) => [
      ...currentIdeas,
      newIdea
    ])

    setShowForm(false)

    await loadIdeas()
  }

  async function handleDeleteIdea(id) {
    if (!currentUserId) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/ideas/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            user_id: currentUserId
          })
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to delete idea'
        )
      }

      setIdeas((currentIdeas) =>
        currentIdeas.filter(
          (idea) => idea.id !== id
        )
      )

      setSelectedIdea(null)
    } catch (error) {
      alert(
        error.message ||
          'Unable to delete idea.'
      )
    }
  }

  async function handleStatusChange(
    id,
    status
  ) {
    if (!currentUserId) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/ideas/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            user_id: currentUserId,
            status
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update idea'
        )
      }

      setIdeas((currentIdeas) =>
        currentIdeas.map((idea) =>
          idea.id === id
            ? {
                ...idea,
                ...data.idea,
                isPublic:
                  data.idea.privacy ===
                  'public'
              }
            : idea
        )
      )

      if (selectedIdea?.id === id) {
        setSelectedIdea(
          (currentIdea) => ({
            ...currentIdea,
            ...data.idea,
            isPublic:
              data.idea.privacy ===
              'public'
          })
        )
      }
    } catch (error) {
      alert(
        error.message ||
          'Unable to update idea.'
      )
    }
  }

  async function handleCardClick(idea) {
    try {
      const response = await fetch(
        `${API_URL}/ideas/${idea.id}`
      )

      if (!response.ok) {
        throw new Error(
          'Failed to load idea'
        )
      }

      const data = await response.json()

      const taskResponse = await fetch(
        `${API_URL}/tasks`
      )

      const tasks =
        taskResponse.ok
          ? await taskResponse.json()
          : []

      setSelectedIdea({
        ...data,
        isPublic:
          data.privacy === 'public',
        iconColor: idea.iconColor,
        tasks: tasks.filter(
          (task) =>
            task.idea_id === idea.id &&
            task.user_id === currentUserId
        )
      })
    } catch {
      alert('Unable to open idea.')
    }
  }

  function closeDetails() {
    setSelectedIdea(null)
  }

  async function handleAddTask(
    ideaId,
    taskTitle
  ) {
    try {
      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            title: taskTitle,
            description: taskTitle,
            user_id: currentUserId,
            idea_id: ideaId
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to create task'
        )
      }

      const data = await response.json()
      const newTask = data.task

      setIdeas((currentIdeas) =>
        currentIdeas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: [
                  ...(idea.tasks || []),
                  newTask
                ]
              }
            : idea
        )
      )

      setSelectedIdea(
        (currentIdea) => ({
          ...currentIdea,
          tasks: [
            ...(currentIdea.tasks || []),
            newTask
          ]
        })
      )
    } catch {
      alert('Unable to create task.')
    }
  }

  async function handleDeleteTask(
    ideaId,
    taskId
  ) {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            user_id: currentUserId
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to delete task'
        )
      }

      setIdeas((currentIdeas) =>
        currentIdeas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: (
                  idea.tasks || []
                ).filter(
                  (task) =>
                    task.id !== taskId
                )
              }
            : idea
        )
      )

      setSelectedIdea(
        (currentIdea) => ({
          ...currentIdea,
          tasks: (
            currentIdea.tasks || []
          ).filter(
            (task) =>
              task.id !== taskId
          )
        })
      )
    } catch {
      alert('Unable to delete task.')
    }
  }

  async function handleEditTask(
    ideaId,
    taskId,
    newTitle
  ) {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            user_id: currentUserId,
            title: newTitle,
            description: newTitle
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to update task'
        )
      }

      const data = await response.json()

      setIdeas((currentIdeas) =>
        currentIdeas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: (
                  idea.tasks || []
                ).map((task) =>
                  task.id === taskId
                    ? data.task
                    : task
                )
              }
            : idea
        )
      )

      setSelectedIdea(
        (currentIdea) => ({
          ...currentIdea,
          tasks: (
            currentIdea.tasks || []
          ).map((task) =>
            task.id === taskId
              ? data.task
              : task
          )
        })
      )
    } catch {
      alert('Unable to update task.')
    }
  }

  if (!currentUserId) {
    return (
      <main className="vault-page">
        <div className="vault-header">
          <h1>YOUR IDEAS</h1>
        </div>

        <p>
          Log in to see your ideas.
        </p>
      </main>
    )
  }

  return (
    <main className="vault-page">
      <div className="vault-header">
        <h1>𝕐𝕆𝕌ℝ 𝕀𝔻𝔼𝔸𝕊</h1>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          Quick Add
        </button>
      </div>

      {showForm && (
        <QuickAdd
          onAddIdea={handleAddIdea}
        />
      )}

      {loading && (
        <p>Loading your ideas...</p>
      )}

      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        ideas.length === 0 && (
          <p>
            You haven't added any ideas yet.
          </p>
        )}

      {!loading &&
        !error &&
        ideas.length > 0 && (
          <div className="idea-grid">
            {ideas.map((idea) => (
              <article
                key={idea.id}
                className="vault-idea-card"
                style={{
                  backgroundColor:
                    idea.iconColor ||
                    '#fff8e7'
                }}
                onClick={() =>
                  handleCardClick(idea)
                }
              >
                <div className="vault-card-content">
                  <h2>{idea.title}</h2>

                  <p>
                    {idea.description.length >
                    20
                      ? `${idea.description.slice(
                          0,
                          20
                        )}...`
                      : idea.description}
                  </p>
                </div>

                <div className="vault-card-footer">
                  <span>
                    {idea.isPublic
                      ? 'Public'
                      : 'Private'}
                  </span>

                  <span className="vault-card-status">
                    {idea.category}
                  </span>

                  <select
                    value={idea.status}
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        idea.id,
                        event.target.value
                      )
                    }
                  >
                    <option value="Thinking">
                      Thinking
                    </option>

                    <option value="Building">
                      Building
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}

      {selectedIdea && (
        <IdeaDetails
          idea={selectedIdea}
          onClose={closeDetails}
          onDeleteIdea={
            handleDeleteIdea
          }
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={
            handleDeleteTask
          }
        />
      )}
    </main>
  )
}

export default Vault