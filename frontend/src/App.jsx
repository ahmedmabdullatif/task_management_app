import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setAdding(true);
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1>Task Manager</h1>
          <p className="subtitle">Stay organized, get things done</p>
        </header>

        {/* Add Task Form */}
        <form className="add-form" onSubmit={addTask}>
          <input
            id="task-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={adding}
            autoComplete="off"
          />
          <button id="add-task-btn" type="submit" disabled={adding || !title.trim()}>
            {adding ? (
              <span className="spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="loading">
              <span className="spinner large" />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="12" x2="15" y2="12" />
              </svg>
              <p>No tasks yet</p>
              <span>Add your first task above to get started</span>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                className="task-item"
                key={task.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="task-content"
                  onClick={() => toggleTask(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id); }}
                  title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                  aria-label={`Toggle task: ${task.title}`}
                >
                  <span
                    className={`task-status ${task.completed ? 'completed' : 'pending'}`}
                  >
                    {task.completed ? '✓' : '○'}
                  </span>
                  <span className={`task-title ${task.completed ? 'done' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  aria-label={`Delete task: ${task.title}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="footer">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
