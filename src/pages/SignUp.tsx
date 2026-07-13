import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERS_KEY = "aa-mobile-users"

type StoredUser = {
  name: string
  email: string
  password: string
}

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]")
  } catch {
    return []
  }
}

function saveUser(user: StoredUser) {
  const users = loadUsers().filter((existing) => existing.email !== user.email)
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

type Mode = "signup" | "login"

export default function SignUp() {
  const [mode, setMode] = useState<Mode>("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [successName, setSuccessName] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Enter your name.")
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.")
        return
      }
      saveUser({ name: name.trim(), email, password })
      setSuccessName(name.trim())
    } else {
      const users = loadUsers()
      const match = users.find((user) => user.email === email && user.password === password)
      if (!match) {
        setError("No account matches that email and password.")
        return
      }
      setSuccessName(match.name)
    }
  }

  if (successName) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <span className="badge">
            {mode === "signup" ? "Account created" : "Signed in"}
          </span>
          <h1>Welcome, {successName}.</h1>
          <p>
            {mode === "signup"
              ? "Your AA Mobile account is ready. We'll email you when phones on your wishlist drop in price."
              : "You're signed back in."}
          </p>
          <Link className="pill-button" to="/">
            Continue to the shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="badge">{mode === "signup" ? "Create an account" : "Welcome back"}</span>
        <h1>{mode === "signup" ? "Sign up for AA Mobile" : "Log in"}</h1>
        <p className="auth-subhead">
          {mode === "signup"
            ? "Save your favourites, track trade-in quotes, and get price-drop alerts."
            : "Enter your details to access your account."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Smith"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hi@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>

          {mode === "signup" && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="pill-button pill-button-solid auth-submit">
            {mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setMode((m) => (m === "signup" ? "login" : "signup"))
            setError("")
          }}
        >
          {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </div>
    </section>
  )
}
