/** AdminView Component
 * This component will render if you log in with an admin account / if you have the ADMIN role.
 * When entering this page we recieve all the users and books through our "loader".
 * We display all the books and users through smaller components.
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { redirect, useLoaderData } from "react-router-dom";
import { fetchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import parseJwt from "../service/jwtService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";
import { getUsers } from "../service/userService";
import UserAction from "../components/UserAction";
import BookTable from "../components/BookTable";
import MapBooks from "../components/MapBooks";
import MapUsers from "../components/MapUsers";
import SubHeader from "../components/SubHeader";
import { polling } from "../service/pollingService";
import UserTable from "../components/UserTable";


export async function loader() {
  const authtoken = sessionStorage.getItem("AuthToken");
  const userInfo = parseJwt(authtoken);
  console.log(userInfo)

  if (!userInfo) {
    return redirect("/login");
  }
  if (userInfo.role !== "ADMIN") {
    return redirect("/login");
  }
  if(userInfo.exp * 1000 < Date.now()) {
    return redirect("/login")
  }

  const loaderBooks = await fetchBooks();
  loaderBooks.books.forEach((book) => {
    book.order = 0;
  });

  const loaderUsers = await getUsers();

  return { loaderBooks, loaderUsers };
}

export default function AdminView() {
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  const [editBook, setEditBook] = useState(null)
  const [addBook, setAddBook] = useState(false)
  const [toggleTable, setToggleTable] = useState(true)
  const [users, setUsers] = useState(null)
  const [userElements, setUserElements] = useState(null)
  const [toggleAction, setToggleAction] = useState(false)
  const [user, setUser] = useState(null)
  const [action, setAction] = useState(undefined)
  

  let { loaderBooks, loaderUsers } = useLoaderData();


  // Adding order=0 to our books
  // setting our books to so we can render them out
  useEffect(() => {
    setBooks(loaderBooks.books);
    setUsers(loaderUsers);
    sessionStorage.setItem("BooksVersion", loaderBooks.version)
  }, [loaderBooks, loaderUsers]);


  useEffect(() => {
    const interval = setInterval(async () => {
      const newVersion = await polling(books);
      console.log(newVersion);
      setBooks(newVersion);
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

  
  function handleUserAction(event) {
    const { value } = event.target;
    const user = users[value];
    const name = event.target.name;
    
    setAction(name)
    setUser(user);
    setToggleAction(true);
  }


  // Mapping through our books and rendering bookElements in our jsx
  useEffect(() => {
    if(books !== null) {
      const mappedBooks = <MapBooks books={books} setBooks={setBooks} editBook={editBook} setEditBook={setEditBook} setUsers={setUsers}/>
      setBookElements(mappedBooks);
    }
    
    if(books !== null) {
      const mappedUsers = <MapUsers users={users} handleUserAction={handleUserAction} />
      setUserElements(mappedUsers);
    }
    
  //eslint-disable-next-line
  }, [books, editBook, users]);


  return (
    <>
      <SubHeader setBooks={setBooks} setAddBook={setAddBook} setToggleTable={setToggleTable}/>

      {toggleAction && <UserAction user={user} setUsers={setUsers} toggle={setToggleAction} action={action}/>}

      {toggleTable && <BookTable bookElements={bookElements}/>}
      {!toggleTable && <UserTable userElements={userElements}/>}

      {addBook && <AddBook toggle={setAddBook} render={setBooks}/>}
      {editBook && <EditBook book={editBook} toggle={setEditBook} render={setBooks}/>}
    </>
  );
}