

import { fetchBooks } from "./bookService";

export async function polling(books) {
  const newBooks = await fetchBooks();
  const currentVersion = sessionStorage.getItem("BooksVersion");
  console.log(newBooks, currentVersion);
  if (String(newBooks.version) !== String(currentVersion)) {
    console.log("they are not the same");
    for (let i = 0; i < newBooks.books.length; i++) {
      if (books[i]) {
        newBooks.books[i].order = books[i].order;
      } else {
        newBooks.books[i].order = 0;
      }
    }

    sessionStorage.setItem("BooksVersion", newBooks.version);
    return newBooks.books;
  } else {
    console.log("they are the same");
    return books;
  }
}