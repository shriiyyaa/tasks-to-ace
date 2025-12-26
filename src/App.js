import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  /* Load tasks */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  /* Save tasks */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* Theme */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, completed: false },
    ]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.completed) {
          confetti({
            particleCount: 40,
            spread: 60,
            startVelocity: 20,
            origin: { y: 0.75 },
          });
        }
        return t.id === id ? { ...t, completed: !t.completed } : t;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>Tasks to Ace</h1>

          {/* CLEAN THEME TOGGLE */}
          <button
            className="theme-toggle"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀︎" : "☾"}
          </button>
        </div>

        <div className="input-row">
          <input
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* TABLE APPEARS ONLY WHEN TASKS EXIST */}
        {tasks.length > 0 && (
          <div className="table-wrapper">
            <table className="task-table">
              <colgroup>
                <col style={{ width: "60px" }} />
                <col />
                <col style={{ width: "120px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "80px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Task</th>
                  <th>Completed</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>{index + 1}</td>

                      <td>
                        {editingId === task.id ? (
                          <input
                            className="edit-input"
                            value={editText}
                            onChange={(e) =>
                              setEditText(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setTasks(
                                  tasks.map((t) =>
                                    t.id === task.id
                                      ? { ...t, text: editText }
                                      : t
                                  )
                                );
                                setEditingId(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          task.text
                        )}
                      </td>

                      <td>
                        <div className="completed-cell">
                          <button
                            className={`complete-btn ${
                              task.completed ? "checked" : ""
                            }`}
                            onClick={() =>
                              toggleComplete(task.id)
                            }
                          >
                            {task.completed && "✓"}
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingId(task.id);
                            setEditText(task.text);
                          }}
                        >
                          ✎
                        </button>
                      </td>

                      <td>
                        <button
                          className="icon-btn"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          🗑
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
