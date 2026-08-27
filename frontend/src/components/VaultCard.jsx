function VaultCard({ idea, onClick, onStatusChange }) {
  return (
    <article
      className="vault-idea-card"
      style={{
        backgroundColor: idea.iconColor || '#fff8e7'
      }}
      onClick={() => onClick(idea)}
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
            onStatusChange(idea.id, event.target.value)
          }
        >
          <option value="Thinking">Thinking</option>
          <option value="Building">Building</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </article>
  )
}

export default VaultCard