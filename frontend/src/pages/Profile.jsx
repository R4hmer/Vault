import './Profile.css'

function Profile() {
  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">♙</div>

        <div className="profile-info">
          <h1>YOUR PROFILE</h1>
          <p>@username</p>
          <span>
            Ideas, experiments and things I want to bring to life.
          </span>
        </div>
      </section>

      <section className="profile-interests">
        <h2>ABOUT ME</h2>
        <p>
          A space to share ideas, explore possibilities and find out
          whether an idea is worth bringing to life.
        </p>
      </section>

      <section className="profile-ideas">
        <h2>PUBLIC IDEAS</h2>

        <div className="profile-empty">
          <p>Your public ideas will appear here.</p>
        </div>
      </section>

      <button className="profile-get-started">Get Started</button>
    </main>
  )
}

export default Profile