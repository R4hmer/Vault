import { useState } from 'react'

function IdeaDetails({
  idea,
  onClose,
  onDeleteIdea,
  onAddTask,
  onEditTask,
  onDeleteTask
}) {
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState('')

  function handleAddTask() {
    if (!taskTitle.trim()) {
      return
    }

    onAddTask(idea.id, taskTitle.trim())
    setTaskTitle('')
    setShowTaskInput(false)
  }

  function startEditingTask(task) {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
  }

  function saveEditedTask() {
    if (!editingTaskTitle.trim()) {
      return
    }

    onEditTask(
      idea.id,
      editingTaskId,
      editingTaskTitle.trim()
    )

    setEditingTaskId(null)
    setEditingTaskTitle('')
  }

  return (
    <div
      className="idea-modal-overlay"
      onClick={onClose}
    >
      <div
        className="idea-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close idea details"
        >
          ×
        </button>

        <div className="modal-header">
          <span className="modal-privacy">
            {idea.isPublic ? 'Public' : 'Private'}
          </span>

          <h2>{idea.title}</h2>

          <p>{idea.description}</p>
        </div>

        <div className="modal-section">
          <div className="section-heading">
            <h3>Roadmap</h3>

            <button
              className="add-task-button"
              onClick={() => setShowTaskInput(!showTaskInput)}
            >
              + Add Task
            </button>
          </div>

          {showTaskInput && (
            <div className="task-input-row">
              <input
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(event.target.value)
                }
                placeholder="Enter a roadmap task..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleAddTask()
                  }
                }}
              />

              <button
                className="task-save-button"
                onClick={handleAddTask}
              >
                Add
              </button>
            </div>
          )}

          {idea.tasks?.length > 0 ? (
            <div className="task-list">
              {idea.tasks.map((task) => (
                <div
                  className="task-item"
                  key={task.id}
                >
                  {editingTaskId === task.id ? (
                    <div className="task-edit-row">
                      <input
                        value={editingTaskTitle}
                        onChange={(event) =>
                          setEditingTaskTitle(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            saveEditedTask()
                          }
                        }}
                      />

                      <button
                        className="task-save-button"
                        onClick={saveEditedTask}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{task.title}</span>

                      <div className="task-actions">
                        <button
                          onClick={() =>
                            startEditingTask(task)
                          }
                          aria-label="Edit task"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() =>
                            onDeleteTask(
                              idea.id,
                              task.id
                            )
                          }
                          aria-label="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !showTaskInput && (
              <div className="empty-state">
                <p>No roadmap tasks yet.</p>
              </div>
            )
          )}
        </div>

        {idea.isPublic && (
          <div className="modal-section">
            <h3>Feedback</h3>

            <div className="empty-state">
              <p>No feedback yet.</p>
            </div>
          </div>
        )}

        <button
          className="modal-delete-button"
          onClick={() => onDeleteIdea(idea.id)}
          aria-label="Delete idea"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default IdeaDetails