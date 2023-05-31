import { fireEvent, render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, } from "react-router-dom";
import Layout from "../components/Layout";
import AdminView, {loader as adminLoader} from "../pages/AdminView";
import { loginUser } from "../service/authService";
import { fetchBooks } from "../service/bookService";

test("Check if book is added to database", async () => {
    const data = await loginUser({username: "Bob", password: "123"})
    sessionStorage.setItem("AuthToken", data.accessToken)
    
    const router = createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<AdminView />} loader={adminLoader} />
          </Route>
        )
    );
    render(<RouterProvider router={router} />);

    const addBookBtn = await screen.findByTestId("add-book-btn");
    fireEvent.click(addBookBtn);

    const addBookTitle = await screen.findByTestId("add-book-title");
    const addBookAuthor = await screen.findByTestId("add-book-author");
    const addBookQuantity = await screen.findByTestId("add-book-quantity");
    const saveBookBtn = await screen.findByTestId("save-book-btn");

    fireEvent.change(addBookTitle, { target: { value: "Test book" } });
    fireEvent.change(addBookAuthor, { target: { value: "Dennis" } });
    fireEvent.change(addBookQuantity, { target: { value: 5 } });
    fireEvent.click(saveBookBtn);
    
    const resp = await fetchBooks();
    const lastBook = resp.books.slice(-1);
    console.log(lastBook);

    expect(lastBook[0].title).toBe("Test book");
    expect(lastBook[0].author).toBe("Dennis");
    expect(lastBook[0].quantity).toBe("5");

})