document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.querySelector("#list");
    const bookDetails = document.querySelector("#show-panel");
    let books = [];
    let currentUser = { id: 1, username: "pouros" };
    
    // Fetch all books and render them in a list
    function fetchBooks() {
      fetch("http://localhost:3000/books")
        .then((response) => response.json())
        .then((data) => {
          books = data;
          renderBooks();
        })
        .catch((error) => console.error(error));
    }
    
    function renderBooks() {
      bookList.innerHTML = "";
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
      });
    }
    
    // Show details of a selected book
    function showBookDetails(book) {
      bookDetails.innerHTML = "";
      const img = document.createElement("img");
      img.src = book.img_url;
      bookDetails.appendChild(img);
      const title = document.createElement("h2");
      title.textContent = book.title;
      bookDetails.appendChild(title);
      const subtitle = document.createElement("h3");
      subtitle.textContent = book.subtitle;
      bookDetails.appendChild(subtitle);
      const author = document.createElement("h4");
      author.textContent = book.author;
      bookDetails.appendChild(author);
      const description = document.createElement("p");
      description.textContent = book.description;
      bookDetails.appendChild(description);
      const likes = document.createElement("p");
      likes.textContent = "Liked by:";
      bookDetails.appendChild(likes);
      const ul = document.createElement("ul");
      book.users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = user.username;
        ul.appendChild(li);
      });
      bookDetails.appendChild(ul);
      const likeButton = document.createElement("button");
      likeButton.textContent = "Like";
      likeButton.addEventListener("click", () => likeBook(book));
      bookDetails.appendChild(likeButton);
    }
    
    // Update the list of users who like the book on like button click
    function likeBook(book) {
      if (book.users.some(user => user.id === currentUser.id)) {
        // User has already liked the book, remove them from the list
        const updatedUsers = book.users.filter(user => user.id !== currentUser.id);
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ users: updatedUsers }),
        })
          .then(() => {
            book.users = updatedUsers;
            showBookDetails(book);
          })
          .catch((error) => console.error(error));
      } else {
        // User has not liked the book, add them to the list
        const updatedUsers = [...book.users, currentUser];
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ users: updatedUsers }),
        })
          .then(() => {
            book.users = updatedUsers;
            showBookDetails(book);
          })
          .catch((error) => console.error(error));
      }
    }
    
    // Fetch books on page load
    fetchBooks();
  });
  