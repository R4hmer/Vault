import { useState } from 'react'

function QuickAdd({ onAddIdea }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('Thinking')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !description.trim() || !category.trim()) {
      setError('Please fill out the field first.')
      return
    }

    const newIdea = {
      id: Date.now(),
      title,
      description,
      category,
      status,
      isPublic
    }

    onAddIdea(newIdea)

    setTitle('')
    setDescription('')
    setCategory('')
    setStatus('Thinking')
    setIsPublic(false)
    setError('')
  }

  return (
    <form className="quick-add-form" onSubmit={handleSubmit}>
      <h2>Add a new idea</h2>

      {error && <p className="form-error">{error}</p>}

      <label>Idea title</label>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <label>Category</label>
      <input
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />

      <label>Status</label>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="Thinking">Thinking</option>
        <option value="Building">Building</option>
        <option value="Completed">Completed</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
        />
        Public idea
      </label>

      <button type="submit">Save Idea</button>
    </form>
  )
}

export default QuickAdd