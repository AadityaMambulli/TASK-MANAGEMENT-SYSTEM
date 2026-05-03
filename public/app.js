const API = '/api/tasks';
let allTasks = [];
let currentFilter = 'all';

// ─── FETCH ALL TASKS ───────────────────────────────
async function loadTasks() {
  try {
    const res = await fetch(API);
    const json = await res.json();
    allTasks = json.data || [];
    renderTasks();
  } catch (err) {
    document.getElementById('taskList').innerHTML =
      '<p class="loading">❌ Could not load tasks. Is the server running?</p>';
  }
}

// ─── RENDER TASKS ──────────────────────────────────
function renderTasks() {
  const list = document.getElementById('taskList');
  const filtered = currentFilter === 'all'
    ? allTasks
    : allTasks.filter(t => t.status === currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><h3>No tasks found</h3><p>Add one above!</p></div>';
    return;
  }

  list.innerHTML = filtered.map(task => `
    <div class="task-card" id="card-${task.id}">
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description || 'No description')}</p>
      <div class="task-meta">
        <span class="badge priority-${task.priority}">${task.priority}</span>
        <span class="badge status-${task.status}">${task.status}</span>
      </div>
      <div class="task-actions">
        <select onchange="updateStatus('${task.id}', this.value)">
          <option value="pending"     ${task.status === 'pending'     ? 'selected' : ''}>Pending</option>
          <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed"   ${task.status === 'completed'   ? 'selected' : ''}>Completed</option>
        </select>
        <button class="btn-delete" onclick="deleteTask('${task.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

// ─── CREATE TASK ───────────────────────────────────
async function createTask() {
  const title    = document.getElementById('taskTitle').value.trim();
  const desc     = document.getElementById('taskDesc').value.trim();
  const priority = document.getElementById('taskPriority').value;

  if (!title) {
    alert('Please enter a task title!');
    return;
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, priority })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value  = '';
      loadTasks();
    }
  } catch (err) {
    alert('Failed to create task');
  }
}

// ─── UPDATE STATUS ─────────────────────────────────
async function updateStatus(id, status) {
  try {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadTasks();
  } catch (err) {
    alert('Failed to update task');
  }
}

// ─── DELETE TASK ───────────────────────────────────
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
  } catch (err) {
    alert('Failed to delete task');
  }
}

// ─── FILTER ────────────────────────────────────────
function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks();
}

// ─── HELPER ────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Load on page start
loadTasks();