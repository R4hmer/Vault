import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">𝒱𝒶𝓊𝓁𝓉</span>
        <span className="footer-slogan">Ideas worth building.</span>
      </div>

      <div className="footer-section">
        <h3>Contact</h3>

        <a href="https://github.com/R4hmer" target="_blank" rel="noreferrer">
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/halimasaadia-abdiazziz-148756410"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>

      <div className="footer-section">
        <h3>About</h3>

        <a href="/about">About Vault</a>
      </div>
    </footer>
  )
}

export default Footer