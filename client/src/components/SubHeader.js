/** SubHeader component
 * Renders search field and buttons to navigate as an admin
 */

import { useState } from "react";
import { fetchBooks, searchBooks } from "../service/bookService";



export default function SubHeader({setBooks, setAddBook, setToggleTable}) {
    const [search, setSearch] = useState("");

    // Saving our search input
    async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    
    if (value === "") {
        const data = await fetchBooks()
        data.books.forEach(book => {
          book.order = 0;
        });

        setBooks(data.books)
    }
  }

    // When we press enter 
    async function handleKeyDown(event) {
    if (event.code === "Enter") {
        let books = await searchBooks(search);

        books.forEach(book => {
            book.order = 0;
        });
      
      setBooks(books);
    }
  }

    return(
        <div className="controller-container">
        <input
        className="search-input"
          type="search"
          placeholder="Search..."
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />

        <button data-testid="add-book-btn" className="add-book-btn" onClick={() => setAddBook(true)}>Add new book</button>

        <div className="btn-container">
          <button onClick={() => setToggleTable(true)} className="book-btn">Books</button>
          <button onClick={() => setToggleTable(false)} className="user-btn">Users</button>
        </div>
      </div>
    )
}