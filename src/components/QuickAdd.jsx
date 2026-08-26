import { useState } from 'react'

const ideaColors = [
  '#F3E5DE',
  '#F1E7DC',
  '#F4F0DF',
  '#E8E9D8',
  '#E3E8E0',
  '#EEE5D9'
]

function QuickAdd({ onAddIdea }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('Thinking')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedColor, setSelectedColor] = useState(ideaColors[0])
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
      isPublic,
      iconColor: selectedColor
    }

    onAddIdea(newIdea)

    setTitle('')
    setDescription('')
    setCategory('')
    setStatus('Thinking')
    setIsPublic(false)
    setSelectedColor(ideaColors[0])
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

      <label>Card colour</label>

      <div className="color-options">
        {ideaColors.map((color) => (
          <button
            type="button"
            key={color}
            className={`color-option ${
              selectedColor === color ? 'selected' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select card colour ${color}`}
          />
        ))}
      </div>

      <label>Status</label>

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="Thinking">Thinking</option>
        <option value="Building">Building</option>
        <option value="Completed">Completed</option>
      </select>

      <label className="public-checkbox">
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