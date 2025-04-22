let draggedItem = null;

document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', e => {
        draggedItem = task;
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', e => {
        task.classList.remove('dragging');
        draggedItem = null;
    });
});

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(column, e.clientY);
        if (afterElement == null) {
            column.appendChild(draggedItem);
        } else {
            column.insertBefore(draggedItem, afterElement);
        }
    });

    column.addEventListener('dragenter', e => {
        e.preventDefault();
        column.classList.add('over');
    });

    column.addEventListener('dragleave', e => {
        column.classList.remove('over');
    });

    column.addEventListener('drop', e => {
        column.classList.remove('over');
    });
});

// Пошук найближчого елементу відносно позиції миші
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
