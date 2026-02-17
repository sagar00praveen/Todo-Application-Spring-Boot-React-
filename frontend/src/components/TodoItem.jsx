import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDesc, setEditDesc] = useState(todo.description);

    const handleUpdate = () => {
        onUpdate(todo.id, { ...todo, title: editTitle, description: editDesc });
        setIsEditing(false);
    };

    const toggleComplete = () => {
        onUpdate(todo.id, { ...todo, completed: !todo.completed });
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {isEditing ? (
                <div className="edit-mode">
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="view-mode">
                    <div className="content">
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                    </div>
                    <div className="actions">
                        <button
                            onClick={toggleComplete}
                            className={todo.completed ? "undo-btn" : "complete-btn"}
                            title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        >
                            {todo.completed ? "Undo" : "Complete"}
                        </button>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(todo.id)}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoItem;
