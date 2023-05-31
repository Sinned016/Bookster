/** GuestView Component
 * This component will render if browse as guest.
 * When entering this page we recieve all the books through our "loader".
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { useLoaderData } from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { polling } from "../service/pollingService";

export function loader() {
  return fetchBooks();

}

export default function GuestView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  let loaderBooks = useLoaderData();


  useEffect(() => {
    setBooks(loaderBooks.books);
  }, [loaderBooks]);

  //Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      const newVersion = await polling(books);
      console.log(newVersion);
      setBooks(newVersion);
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);


  useEffect(() => {
    const bookElements = books?.map((book, index) => {
      return (
        <tr key={index}>
          <td data-testid="book-title">{book.title}</td>
          <td>{book.author}</td>
          <td>{book.quantity === 0 ? "Out of stock" : book.quantity + " left"}</td>
        </tr>
      );
    });
    setBookElements(bookElements);
  }, [books]);


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

  async function handleKeyDown(event) {
    if (event.code === "Enter") {
      let books = await searchBooks(search);
      
      setBooks(books);
    }
  }

  return (
    <>
      <input
        data-testid="search-input"
        className="guestView-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <table className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    </>
  );
}