const API_URL = import.meta.env.VITE_API_URL

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed')
  }

  return data
}

export function getIdeas() {
  return apiRequest('/ideas')
}

export function createIdea(idea) {
  return apiRequest('/ideas', {
    method: 'POST',
    body: JSON.stringify(idea)
  })
}

export function updateIdea(id, data) {
  return apiRequest(`/ideas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function deleteIdea(id, userId) {
  return apiRequest(`/ideas/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: userId
    })
  })
}

export function likeIdea(ideaId, userId) {
  return apiRequest(`/ideas/${ideaId}/like`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId
    })
  })
}

export function unlikeIdea(ideaId, userId) {
  return apiRequest(`/ideas/${ideaId}/like`, {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: userId
    })
  })
}

export function favouriteIdea(ideaId, userId) {
  return apiRequest(`/ideas/${ideaId}/favourite`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId
    })
  })
}

export function unfavouriteIdea(ideaId, userId) {
  return apiRequest(`/ideas/${ideaId}/favourite`, {
    method: 'DELETE',
    body: JSON.stringify({
      user_id: userId
    })
  })
}

export function getComments() {
  return apiRequest('/comments')
}

export function createComment(text, userId, ideaId) {
  return apiRequest('/comments', {
    method: 'POST',
    body: JSON.stringify({
      text,
      user_id: userId,
      idea_id: ideaId
    })
  })
}

export function getTasks() {
  return apiRequest('/tasks')
}

export function createTask(title, description, userId, ideaId) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      user_id: userId,
      idea_id: ideaId
    })
  })
}

export function updateTask(taskId, data) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE'
  })
}

export function getNotifications(userId) {
  return apiRequest(`/notifications/user/${userId}`)
}

export function getNotification(notificationId) {
  return apiRequest(`/notifications/${notificationId}`)
}

export function markNotificationRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PUT'
  })
}

export function deleteNotification(notificationId) {
  return apiRequest(`/notifications/${notificationId}`, {
    method: 'DELETE'
  })
}