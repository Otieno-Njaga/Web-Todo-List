const textarea = document.querySelector("textarea");
const addBtn = document.getElementById("addBtn");
const todocontainer = document.querySelector(".todocontainer");

const API_URL = "http://localhost:5000/tasks"; // Backend URL

// Fetch and display tasks from the backend
async function fetchTodos() {
  const response = await fetch(API_URL);
  const todos = await response.json();
  updateUI(todos);
}

// Add a new task
async function addTodo() {
  const description = textarea.value.trim();
  if (!description) return;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (response.ok) {
    textarea.value = "";
    fetchTodos();
  }
}

// Edit a task
async function editTodo(id, description) {
  textarea.value = description;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  fetchTodos();
}

// Delete a task
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  fetchTodos();
}

// Update the UI
function updateUI(todos) {
  todocontainer.innerHTML = todos
    .map(
      (todo) => `
      <div class="todo">
        <p>${todo.description}</p>
        <div class="btnContainer">
          <button class="iconBtn" onclick="editTodo(${todo.id}, '${todo.description}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="iconBtn" onclick="deleteTodo(${todo.id})">
            <i class="fa-solid fa-delete-left"></i>
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

// Load todos on page load
fetchTodos();
addBtn.addEventListener("click", addTodo);
