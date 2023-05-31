/** Component AddBook
 * We render this component whenever we press the button "Add new book"
 */

import { useState } from "react";
import { actionAdd } from "../service/actionService";


const AddBook = ({toggle, render}) => {
    const [inputValues, setInputValues] = useState({
        title: "",
        author: "",
        quantity: ""
    })

    function handleChange(event) {
        const { name, value } = event.target;
        setInputValues((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }
    
    async function saveChanges() {
        const data = await actionAdd(inputValues)
        console.log(data)
        if(data.message === "book added successfully") {
            
            data.context.books.forEach(book => {
                book.order = 0;
            });

            render(data.context.books)
            alert(`Successfully added new book`)
            toggle(false)
        } else {
            alert(`Failed to add new book`)
        }

        
    }

    return (
        <div className="edit-container">
            <h2 className="edit-title">Add new book</h2>

            <label className="edit-label">Title</label>
            <input data-testid="add-book-title" className="edit-input" onChange={handleChange} name="title" value={inputValues.title} type="text" placeholder="Insert new title..."/>

            <label className="edit-label">Author</label>
            <input data-testid="add-book-author" className="edit-input" onChange={handleChange} name="author" value={inputValues.author} type="text" placeholder="Insert new author..."/>

            <label className="edit-label">Quantity</label>
            <input data-testid="add-book-quantity" className="edit-input" onChange={handleChange} name="quantity" value={inputValues.quantity} type="number" placeholder="Insert new quantity..."/>
        
            <div>
                <button data-testid="save-book-btn" className="edit-btn" onClick={saveChanges} >Add new book</button>
                <button className="edit-btn" onClick={() => toggle(false)}>Discard changes</button>
            </div>
        </div>
    );
}
 
export default AddBook;