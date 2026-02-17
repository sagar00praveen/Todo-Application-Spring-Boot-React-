import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:8081/api/todos'

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      setTodos(response.data)
      setError(null)
    } catch (err) {
      setError('Could not fetch todos. Is the backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (todo) => {
    try {
      const response = await axios.post(API_URL, todo)
      setTodos([...todos, response.data])
    } catch (err) {
      setError('Error adding todo')
      console.error(err)
    }
  }

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTodo)
      setTodos(todos.map(t => t.id === id ? response.data : t))
    } catch (err) {
      setError('Error updating todo')
      console.error(err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setTodos(todos.filter(t => t.id !== id))
    } catch (err) {
      setError('Error deleting todo')
      console.error(err)
    }
  }

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <TodoForm onAdd={addTodo} />
      {error && <div className="error">{error}</div>}
      {loading ? <p>Loading...</p> : (
        <TodoList
          todos={todos}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      )}
    </div>
  )
}

export default App
