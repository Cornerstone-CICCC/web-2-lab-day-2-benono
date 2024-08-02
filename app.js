$(async function () {
  // variables
  const container = $(".container");
  const info = $(".info");
  const postsArea = $(".posts");
  const postsH3 = postsArea.find("h3");
  const postsUl = postsArea.find("ul");
  const todosArea = $(".todos");
  const todosH3 = todosArea.find("h3");
  const todosUl = todosArea.find("ul");
  const previousButton = $("header > button:nth-child(1)");
  const nextButton = $("header > button:nth-child(2)");
  let currentId = 1;
  const idLimit = 30;

  // fetch functions
  async function fetchUserById(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}`,
        type: `GET`,
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }
  async function fetchPostByUserId(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/posts`,
        type: `GET`,
        success: function (response) {
          resolve(response.posts);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  async function fetchTodosByUserId(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/todos`,
        type: `GET`,
        success: function (response) {
          resolve(response.todos);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  // build html function
  function buildHtml(user, posts, todos) {
    // info area
    info.find(".info__image > img").attr("src", user.image);
    info.find(".info__content").html(
      `<h1>${user.firstName} ${user.lastName}</h1>
        <div><strong>Age:</strong>${user.age}</div>
        <div><strong>Email:</strong>${user.email}</div>
        <div><strong>Phone:</strong>${user.phone}</div>`
    );

    // posts area
    postsH3.html(`${user.firstName}'s Posts`);
    if (posts.length === 0) {
      postsUl.html("<li>User has no posts</li>");
    } else {
      postsUl.html("");
      $.each(posts, function (index, post) {
        const li = $("<li>");
        const h4 = $("<h4>", { text: post.title });
        const paragraph = $("<p>", { text: post.body });
        li.append(h4);
        li.append(paragraph);
        postsUl.append(li);
        h4.on("click", function () {
          container.append(`
            <div class="overlay">
              <div class="modal">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <p><strong>Views:</strong>${post.views}</p>
                <button>close Modal</button>
              </div>
            </div>`);
          $(".modal button").on("click", () => $(".overlay").remove());
        });
      });
    }

    // todos area
    todosH3.html(`${user.firstName}'s Todos`);
    if (todos.length === 0) {
      todosUl.html("<li>User has no todos</li>");
    } else {
      todosUl.html("");
      $.each(todos, function (index, todo) {
        todosUl.append(`<li>${todo.todo}</li>`);
      });
    }
  }

  // main function
  async function renderPage(currentId) {
    try {
      const user = await fetchUserById(currentId);
      const posts = await fetchPostByUserId(currentId);
      const todos = await fetchTodosByUserId(currentId);
      buildHtml(user, posts, todos);
    } catch (error) {
      console.error(error);
    }
  }

  // initialize page
  renderPage(currentId);

  // button control
  nextButton.on("click", function () {
    if (currentId === idLimit) {
      currentId = 1;
    } else {
      currentId++;
    }
    renderPage(currentId);
  });
  previousButton.on("click", function () {
    if (currentId === 1) {
      currentId = idLimit;
    } else {
      currentId--;
    }
    renderPage(currentId);
  });
  postsH3.on("click", function () {
    postsUl.slideToggle();
  });
  todosH3.on("click", function () {
    todosUl.slideToggle();
  });
});
