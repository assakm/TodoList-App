
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!input.trim()) return;

    if (editingId !== null) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId
            ? { ...todo, text: input.trim() }
            : todo
        )
      );
      setEditingId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false,
        },
      ]);
    }

    setInput("");
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setInput("");
    }
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function editTodo(todo) {
    setInput(todo.text);
    setEditingId(todo.id);
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <h1>My Todo List</h1>
      <p className="subtitle">Organize your day, one task at a time.</p>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          {editingId !== null ? "Update" : "Add Task"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setInput("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="filter-buttons">
        {["All", "Active", "Completed"].map((item) => (
          <button
            key={item}
            className={filter === item ? "active-filter" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <label className="todo-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

              <span className={todo.completed ? "completed" : ""}>
                {todo.text}
              </span>
            </label>

            <div className="todo-actions">
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="empty-message">No tasks here yet.</p>
      )}

      <p className="task-summary">
        Total: {todos.length} | Completed:{" "}
        {todos.filter((todo) => todo.completed).length}
      </p>
    </div>
  );
}

export default App;
