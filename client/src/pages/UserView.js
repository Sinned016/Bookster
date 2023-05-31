/** UserView Component
 * This component will render if you log in with a user account / if you have the USER role.
 * When entering this page we recieve all the books through our "loader".
 * We display all the books through smaller components.
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { redirect, useLoaderData } from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import parseJwt from "../service/jwtService";
import BookTable from "../components/BookTable";
import MapBooks from "../components/MapBooks";
import { polling } from "../service/pollingService";

export function loader() {
    const token = sessionStorage.getItem("AuthToken")
    const user = parseJwt(token)

    if(!user) {
        return redirect("/login")
    }
    return fetchBooks();
}

export default function UserView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  
  let loaderBooks = useLoaderData();


    // Adding order=0 to our books
    // setting our books to so we can render them out
    useEffect(() => {
      setBooks(loaderBooks.books);
      sessionStorage.setItem("BooksVersion", loaderBooks.version);
      loaderBooks.books.forEach(book => {
          book.order = 0;
      });
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
    

  // Mapping through our books and rendering bookElements in our jsx
  useEffect(() => {
    if(books !== null) {
      const mappedBooks = <MapBooks books={books} setBooks={setBooks} />
      setBookElements(mappedBooks);
    }

    //eslint-disable-next-line
  }, [books]);


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

  return (
    <>
      <input
      className="userView-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <BookTable bookElements={bookElements}/>
    </>
  );
}