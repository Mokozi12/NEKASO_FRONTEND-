
const TOKEN_KEY = 'nekaso_token'
const USER_KEY = 'nekaso_user'

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null
}

function setToken(token, { persistent = false } = {}) {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)

  if (persistent) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.setItem(TOKEN_KEY, token)
  }
}

function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

function getUser() {
  const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY) || null
  try {
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function setUser(user, { persistent = false } = {}) {
  sessionStorage.removeItem(USER_KEY)
  localStorage.removeItem(USER_KEY)
  const raw = JSON.stringify(user)
  if (persistent) {
    localStorage.setItem(USER_KEY, raw)
  } else {
    sessionStorage.setItem(USER_KEY, raw)
  }
}

function removeUser() {
  sessionStorage.removeItem(USER_KEY)
  localStorage.removeItem(USER_KEY)
}

export { getToken, setToken, removeToken, getUser, setUser, removeUser }
