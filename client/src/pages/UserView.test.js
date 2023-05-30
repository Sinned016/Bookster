import { render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, } from "react-router-dom";
import Layout from "../components/Layout";
import UserView, { loader as userLoader} from "./UserView";
import { loginUser } from "../service/authService";

test("Checking if book table is rendered", async () => {
    const data = await loginUser({username: "Yves", password: "123"})
    sessionStorage.setItem("AuthToken", data.accessToken)

    const router = createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<UserView />} loader={userLoader} />
          </Route>
        )
    );

    render(<RouterProvider router={router} />);

    const bookTable = await screen.findByTestId("book-table")

    expect(bookTable).toBeInTheDocument();
})