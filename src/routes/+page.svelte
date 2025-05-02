<script lang="ts">
    import { onMount } from 'svelte';
    import { getTodos, addTodo, deleteTodo, updateTodo } from '$lib/api';
    import { browser } from '$app/environment';

    type Todo = {
        id: number;
        title: string;
        done: boolean;
    };

    let todos: Todo[] = [];
    let newTodo = '';
    let editingId: number | null = null;
    let editText = '';

    let notification = '';
    let notificationType: 'success' | 'error' = 'success';

    function notify(msg: string, type: 'success' | 'error' = 'success') {
        notification = msg;
        notificationType = type;
        setTimeout(() => (notification = ''), 3000);
    }

    onMount(async () => {
        if (browser) {
            try {
                todos = await getTodos();
                notify('📋 Todos loaded!', 'success');
            } catch (err) {
                notify('⚠️ Failed to load todos', 'error');
            }
        }
    });

    async function createTodo() {
        if (newTodo.trim()) {
            try {
                const todo = await addTodo({ title: newTodo, done: false });
                todos = [...todos, todo];
                notify('✅ Todo added!', 'success');
                newTodo = '';
            } catch (err) {
                notify('❌ Failed to add todo', 'error');
            }
        }
    }

    async function removeTodo(id: number) {
        try {
            await deleteTodo(id);
            todos = todos.filter(t => t.id !== id);
            notify('🗑️ Todo deleted!', 'error');
        } catch (err) {
            notify('❌ Failed to delete todo', 'error');
        }
    }

    async function toggleDone(todo: Todo) {
        try {
            const updated = await updateTodo(todo.id, { ...todo, done: !todo.done });
            todo.done = updated.done;
            notify('🔄 Todo updated!', 'success');
        } catch (err) {
            notify('❌ Failed to update todo', 'error');
        }
    }

    function startEdit(todo: Todo) {
        editingId = todo.id;
        editText = todo.title;
    }

    async function saveEdit(todo: Todo) {
        try {
            const updated = await updateTodo(todo.id, { ...todo, title: editText });
            todo.title = updated.title;
            editingId = null;
            notify('✏️ Todo edited!', 'success');
        } catch (err) {
            notify('❌ Failed to save edit', 'error');
        }
    }

    function cancelEdit() {
        editingId = null;
    }

    import './todo.css';
</script>

{#if notification}
    <div class="notification {notificationType}">{notification}</div>
{/if}

<div class="container">
    <h1>My Todo App</h1>

    <div class="form">
        <input
                type="text"
                bind:value={newTodo}
                placeholder="New todo"
                on:keydown={(e) => e.key === 'Enter' && createTodo()} />
        <button on:click={createTodo}>Add</button>
    </div>

    {#if todos.length === 0}
        <p>No todos yet. Add one!</p>
    {/if}

    <ul>
        {#each todos as todo}
            <li>
                <input type="checkbox" bind:checked={todo.done} on:change={() => toggleDone(todo)} />

                {#if editingId === todo.id}
                    <input type="text" bind:value={editText} on:keydown={(e) => e.key === 'Enter' && saveEdit(todo)} />
                    <button on:click={() => saveEdit(todo)}>Save</button>
                    <button on:click={cancelEdit}>Cancel</button>
                {:else}
          <span
                  role="button"
                  tabindex="0"
                  on:dblclick={() => startEdit(todo)}
                  style="text-decoration: {todo.done ? 'line-through' : 'none'}"
          >
            {todo.title}
          </span>
                    <button on:click={() => startEdit(todo)}>Edit</button>
                    <button on:click={() => removeTodo(todo.id)}>Delete</button>
                {/if}
            </li>
        {/each}
    </ul>
</div>
