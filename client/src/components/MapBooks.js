/** MapBooks component
 * Mapping through the books recieved as props and return JSX that canbe used to render the table
 */


import { useNavigate } from "react-router-dom";
import { decreaseBookOrder, deleteClickedBook, increaseBookOrder, placeOrder } from "../service/bookService";
import parseJwt from "../service/jwtService";


export default function MapBooks({books, setBooks, editBook, setEditBook, setUsers}) {
  
  const navigate = useNavigate();
  const decoded = parseJwt(sessionStorage.getItem("AuthToken"))

  // Order function, happens when we press the order button
  async function orderBooks(event) {
    const { data, reRender, reRenderUsers } = await placeOrder(event, books);
    console.log(data);
    if (data.error === "Digital signing is invalid, request new token") {
      navigate("/login");
    } else {
      setBooks(reRender.books);
      if(decoded.role === "ADMIN") {
        setUsers(reRenderUsers);
      }
    }
  }

// Deleteing a book
    async function deleteBook(event) {
    const { reRender } = await deleteClickedBook(event, books);
    setBooks(reRender.books);
  }

// Toggle edit window
  function toggleEdit(event) {
    const { value } = event.target;
    const book = books[value]

    setEditBook(book)
  }

// Increase order number
  function increaseOrder(event) {
    const updateOrder = increaseBookOrder(event, books)
    setBooks(updateOrder);
  }

// Decrease order number
  function decreaseOrder(event) {
    const updateOrder = decreaseBookOrder(event, books)
    setBooks(updateOrder);
  }

    const mappedBooks = books?.map((book, index) => {
        return (
          <tr key={index}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.quantity === 0 ? "Out of stock" : book.quantity + " left"}</td>
            <td className="order-td">
                  <button data-testid="decrease" disabled={book.quantity === 0} value={index} onClick={decreaseOrder}>-</button>
                  <div>{book.order}</div>
                  <button data-testid="increase" disabled={book.quantity === 0} value={index} onClick={increaseOrder}>+</button>
                  <button disabled={book.quantity === 0} value={index} onClick={orderBooks}>Order</button>
            </td>
            {decoded.role === "ADMIN" && <td>
              <button disabled={editBook} value={index} onClick={toggleEdit}>Edit</button>
              <button disabled={editBook}value={index} onClick={deleteBook}>Delete</button>
            </td>}
          </tr>
        );
    });

    return (
        mappedBooks
    )
}