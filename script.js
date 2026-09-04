const STORAGE_KEY = 'field-notes-tasks';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const countLabel = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = tasks.length === 0
      ? 'Nenhuma tarefa ainda. Adicione a primeira acima.'
      : 'Nada por aqui com esse filtro.';
    list.appendChild(empty);
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const checkbox = document.createElement('button');
      checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
      checkbox.setAttribute('aria-label', 'Marcar como concluída');
      checkbox.addEventListener('click', () => toggleTask(task.id));

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete';
      deleteBtn.textContent = '✕';
      deleteBtn.setAttribute('aria-label', 'Excluir tarefa');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      li.append(checkbox, text, deleteBtn);
      list.appendChild(li);
    });
  }

  const pending = tasks.filter(t => !t.completed).length;
  countLabel.textContent = `${pending} tarefa${pending !== 1 ? 's' : ''} pendente${pending !== 1 ? 's' : ''}`;
}

function addTask(text) {
  tasks.push({ id: Date.now(), text, completed: false });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = '';
  input.focus();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

render();
