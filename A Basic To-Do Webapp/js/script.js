const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const modeToggle = document.getElementById("modeToggle");

// Format date and time to a readable string
function formatDateTime(date) {
  return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

// Add new task on button click or Enter key
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    taskInput.value = "";
    taskInput.focus();
  }
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

// Add a task to pending or completed list
function addTask(text, completed = false, addedAt = new Date(), completedAt = null) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  if (completed) li.classList.add("completed");

  // Task text container
  const taskSpan = document.createElement("span");
  taskSpan.className = "task-text";
  taskSpan.textContent = text;

  // Meta info container for date/time
  const metaSpan = document.createElement("span");
  metaSpan.className = "task-meta";
  let metaText = `Added: ${formatDateTime(new Date(addedAt))}`;
  if (completed && completedAt) {
    metaText += ` | Completed: ${formatDateTime(new Date(completedAt))}`;
  }
  metaSpan.textContent = metaText;

  // Buttons container
  const btnDiv = document.createElement("div");
  btnDiv.className = "task-buttons";

  // Complete/Undo button
  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = completed ? "Undo" : "Complete";
  completeBtn.addEventListener("click", () => toggleComplete(li));

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTask(taskSpan, metaSpan));

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => li.remove());

  btnDiv.appendChild(completeBtn);
  btnDiv.appendChild(editBtn);
  btnDiv.appendChild(deleteBtn);

  li.appendChild(taskSpan);
  li.appendChild(metaSpan);
  li.appendChild(btnDiv);

  if (completed) {
    completedList.appendChild(li);
    li.dataset.addedAt = addedAt;
    li.dataset.completedAt = completedAt || new Date().toISOString();
  } else {
    pendingList.appendChild(li);
    li.dataset.addedAt = addedAt;
  }
}

// Toggle task completion state
function toggleComplete(taskItem) {
  const isCompleted = taskItem.classList.contains("completed");
  const text = taskItem.querySelector(".task-text").textContent;
  const addedAt = taskItem.dataset.addedAt || new Date().toISOString();

  taskItem.remove();

  if (isCompleted) {
    addTask(text, false, addedAt);
  } else {
    addTask(text, true, addedAt, new Date().toISOString());
  }
}

// Edit a task's text
function editTask(taskSpan, metaSpan) {
  const currentText = taskSpan.textContent;
  const newText = prompt("Edit your task:", currentText);
  if (newText !== null) {
    const trimmed = newText.trim();
    if (trimmed) {
      taskSpan.textContent = trimmed;
      // Could update meta here if needed
    }
  }
}

// Dark/light mode toggle logic
function loadMode() {
  const savedMode = localStorage.getItem("todoAppMode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    modeToggle.textContent = "🌙";
  }
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    modeToggle.textContent = "☀️";
    localStorage.setItem("todoAppMode", "dark");
  } else {
    modeToggle.textContent = "🌙";
    localStorage.setItem("todoAppMode", "light");
  }
});

// Load saved mode on page load
loadMode();
