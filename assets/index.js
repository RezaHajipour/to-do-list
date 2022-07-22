let toDoItems = [];

const listTasks = document.querySelector("ul");
const listCompleted = document.querySelector(".tasks-completed ul");
const lists = document.querySelector(".main");
const attachDelete = () => document.querySelectorAll('.delete').forEach(deleteButton => {
    deleteButton.onclick = () => deleteTodo(deleteButton.closest('li'))
})

function renderToDo(toDo) {
    localStorage.setItem('toDoItems', JSON.stringify(toDoItems));

    const list = document.querySelector('ul');
    const item = document.querySelector(`[data-key='${toDo.id}']`);

    const isChecked = toDo.checked ? 'checked' : '';
    const node = document.createElement('li');
    node.setAttribute('data-key', toDo.id);
    node.innerHTML = `
                                <div class="task" data-title=${toDo.title}>
                                    <div class="task-check">
                                        <input type="checkbox" class="checkbox-big" ${isChecked}>
                                    </div>
                                    <div class="task-title">
                                        <span contenteditable="true">
                                            ${toDo.title}
                                        </span>
                                    </div>
                                    <div class="task-buttons">
                                        <button class="delete">Delete</button>
                                    </div>
                                </div>
`;

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }

    attachDelete();
}

function deleteTodo(item) {
    // Get the title of the task that was attached to the div class="task" when it's created
    const title = item.children[0].dataset.title
    // Get the latest version of what we have in localStorage
    const toDoItemsUpdate = JSON.parse(localStorage.getItem('toDoItems')) || []
    // Filter the lists of tasks that we have using what we can so here, the title
    toDoItems = toDoItemsUpdate.filter(todoItem => todoItem.title !== title)
    // Update the local storage for data persistence
    localStorage.setItem('toDoItems', JSON.stringify(toDoItems));
    // Remove the targeted item from the DOM
    item.remove()

}

function generateTemplate(value, completed) {
    return `  <li>
    <div class="task">
        <div class="task-check">
            <input class="checkbox-big" type="checkbox" ${completed ? "checked" : ""}>
        </div>
        <div class="task-title">
            <span contenteditable=${completed ? "" : "true"}>
                ${value}
            </span>
        </div>
        <div class="task-buttons">
            <button class="delete">Delete</button>
        </div>
        </div>
    </li>`;
}

lists.addEventListener("click", handleCheckmark)

function handleCheckmark(e) {
    if (e.target.closest(".task-check")) {
        const checkStatus = e.target.closest(".task-check").firstElementChild.checked;
        if (checkStatus) {
            const inputValue = e.target.closest(".task-check").nextElementSibling.innerText;
            const templateCompleted = generateTemplate(inputValue, checkStatus)

            listCompleted.insertAdjacentHTML("beforeend", templateCompleted);
        } else if (checkStatus === false) {
            const inputValue = e.target.closest(".task-check").nextElementSibling.innerText;
            const templateOngoing = generateTemplate(inputValue, checkStatus)
            listTasks.insertAdjacentHTML("beforeend", templateOngoing)
        }
        const checkBtn = e.target.closest(".task-check")
        const listElement = checkBtn.parentNode.parentNode;
        listElement.outerHTML = ""
        ;
    }
    attachDelete();
}

function addTodo(title) {
    const toDo = {
        title,
        checked: false,
        id: Date.now(),
    };

    toDoItems.push(toDo);
    renderToDo(toDo);
}

const form = document.querySelector('.input');

form.addEventListener('submit', e => {

    e.preventDefault();

    const input = document.querySelector('.input-box');

    const title = input.value;
    if (title !== '') {
        addTodo(title);
        input.value = '';
        input.focus();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('toDoItems');

    if (ref) {
        toDoItems = JSON.parse(ref);
        toDoItems.forEach(t => {
            renderToDo(t);
        });
    }
})
