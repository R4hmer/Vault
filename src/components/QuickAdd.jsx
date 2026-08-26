import { useState } from 'react'

const cardColors = [
  '#F4E4D4',
  '#E8E8D0',
  '#DDE8D8',
  '#D8E4E8',
  '#E4DCE8',
  '#F0D9D2'
]

function QuickAdd({ onAddIdea }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('Thinking')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedColor, setSelectedColor] = useState(cardColors[0])

  const isFormValid =
    title.trim() &&
    description.trim() &&
    category.trim()

  function handleSubmit(event) {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    const newIdea = {
      id: Date.now(),
      title,
      description,
      category,
      status,
      isPublic,
      color: selectedColor
    }

    onAddIdea(newIdea)

    setTitle('')
    setDescription('')
    setCategory('')
    setStatus('Thinking')
    setIsPublic(false)
    setSelectedColor(cardColors[0])
  }

  return (
    <form className="quick-add-form" onSubmit={handleSubmit}>
      <h2>Add a new idea</h2>

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
        {cardColors.map((color) => (
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

      <button
        type="submit"
        disabled={!isFormValid}
      >
        Save Idea
      </button>
    </form>
  )
}

export default QuickAdd