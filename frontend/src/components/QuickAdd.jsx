import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL
const CURRENT_USER_ID = 1

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
  const [status, setStatus] = useState('Draft')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedColor, setSelectedColor] =
    useState(ideaColors[0])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim()
    ) {
      setError('Please fill out the field first.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          status,
          privacy: isPublic ? 'public' : 'private',
          user_id: CURRENT_USER_ID
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to create idea.'
        )
      }

      onAddIdea({
        ...data.idea,
        isPublic: data.idea.privacy === 'public',
        iconColor: selectedColor
      })

      setTitle('')
      setDescription('')
      setCategory('')
      setStatus('Draft')
      setIsPublic(false)
      setSelectedColor(ideaColors[0])
      setError('')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="quick-add-form"
      onSubmit={handleSubmit}
    >
      <h2>Add a new idea</h2>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <label>Idea title</label>

      <input
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <label>Description</label>

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
      />

      <label>Category</label>

      <input
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
      />

      <label>Card colour</label>

      <div className="color-options">
        {ideaColors.map((color) => (
          <button
            type="button"
            key={color}
            className={`color-option ${
              selectedColor === color
                ? 'selected'
                : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() =>
              setSelectedColor(color)
            }
            aria-label={`Select card colour ${color}`}
          />
        ))}
      </div>

      <label>Status</label>

      <select
        value={status}
        onChange={(event) =>
          setStatus(event.target.value)
        }
      >
        <option value="Draft">Draft</option>
        <option value="Building">Building</option>
        <option value="Completed">Completed</option>
      </select>

      <label className="public-checkbox">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) =>
            setIsPublic(event.target.checked)
          }
        />

        Public idea
      </label>

      <button
        type="submit"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Idea'}
      </button>
    </form>
  )
}

export default QuickAdd