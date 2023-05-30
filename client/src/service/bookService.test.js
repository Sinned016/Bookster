import { searchBooks } from "./bookService"


test("Checking if you can search for a specific book", async () => {

    const searchedBook = await searchBooks("Eragon")
    console.log(searchedBook)

    expect(searchedBook[0].title).toBe("Eragon")
})