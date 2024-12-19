const formEle = document.querySelector("form");
const inputEle = document.querySelector("#taskName");
const loadingScreen = document.querySelector(".loading");

const apiKey = "6761600260a208ee1fde3bab";

let allTodos = [];

getAllTodos();

formEle.addEventListener("submit", (e) => {
  e.preventDefault();

  if (inputEle.value.trim().length > 0) {
    addTodo();
  }
});

async function addTodo() {
  showLoading();
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
      toastr.success("Added Successfully");
      // we add await here to wait getAllTodo function done first and then reset the form
      await getAllTodos();
      formEle.reset();
    }
  }

  hideLoading();
}

async function getAllTodos() {
  showLoading();
  const res = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
  if (res.ok) {
    const data = await res.json();
    if (data.message === "success") {
      allTodos = data.todos;
      displayTodos();
    }
  }

  hideLoading();
}

function displayTodos() {
  let content = ``;
  for (const todo of allTodos) {
    content += `
    <li
          class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2"
        >
          <span onclick="markCompleted('${todo._id}')" style="${
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

  changeProgress();
}

async function deleteTodo(id) {
  // sweetAlert package
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
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
          Swal.fire({
            title: "Deleted!",
            text: "Your Todo has been deleted.",
            icon: "success",
          });
          getAllTodos();
        }
      }
      hideLoading();
    }
  });
}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todoData = {
        todoId: id,
      };

      const res = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "PUT",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        if (data.message == "success") {
          Swal.fire({
            title: "Completed!",
            icon: "success",
          });
          getAllTodos();
        }
      }

      hideLoading();
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}
function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {
  const completedTask = allTodos.filter((todo) => todo.completed).length;
  const totalTasks = allTodos.length;

  document.querySelector("#progress").style.width = `${
    (completedTask / totalTasks) * 100
  }%`;

  const statusNumber = document.querySelectorAll(".status-number span");
  statusNumber[0].innerHTML = completedTask;
  statusNumber[1].innerHTML = totalTasks;
}
