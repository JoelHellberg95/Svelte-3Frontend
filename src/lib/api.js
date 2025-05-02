const API_BASE = 'https://todoapi-dq99.onrender.com/api/todo';

export async function getTodos() {
    const res = await fetch(API_BASE);
    return await res.json();
}

export async function addTodo(todo) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    return await res.json();
}

export async function deleteTodo(id) {
    return fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
}

export async function updateTodo(id, data) {
    return fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json());
}
