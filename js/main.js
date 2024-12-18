const formEle = document.querySelector("form");
const inputEle = document.querySelector("#taskName");

const apiKey = "6761600260a208ee1fde3bab";

let allTodos = [];

getAllTodos();

formEle.addEventListener("submit", (e) => {
  e.preventDefault();

  addTodo();
});

async function addTodo() {
  const todoObj = {
    title: inputEle.value,
    apiKey: apiKey,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(todoObj),
    headers: {
      "content-type": "application/json",
    },
  };

  const res = await fetch("https://todos.routemisr.com/api/v1/todos", options);
  if (res.ok) {
    const data = await res.json();
    if (data.message === "success") {
      // ///////// getAllData Todo Show
      await getAllTodos();

      formEle.reset();
    }
  }
}

async function getAllTodos() {
  const res = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
  if (res.ok) {
    const data = await res.json();
    if (data.message === "success") {
      allTodos = data.todos;
      displayTodos();
    }
  }
}

function displayTodos() {
  let content = ``;
  for (const todo of allTodos) {
    content += `
    <li
          class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2"
        >
          <span style="${
            todo.completed ? "text-decoration: line-through" : ""
          }" class="task-name">${todo.title}</span>
          <div class="d-flex align-items-center gap-4">

            ${
              todo.completed
                ? '<span><i class="fa-regular fa-circle-check"style="color: #63e6be"></i></span>'
                : ""
            }
            <span onclick="deleteTodo('${todo._id}')" class="icon">
              <i class="fa-solid fa-trash-can"></i>
            </span>
          </div>
        </li>
    `;
  }
  document.querySelector(".task-container").innerHTML = content;
}

async function deleteTodo(id) {
  const todoData = {
    todoId: id,
  };

  const res = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "DELETE",
    body: JSON.stringify(todoData),
    headers: {
      "content-type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();

    if (data.message === "success") {
      getAllTodos();
    }
  }
}
