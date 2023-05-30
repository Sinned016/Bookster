import React from "react"
import { Form, Link, redirect, useActionData } from "react-router-dom"
import { registerUser } from "../service/authService"

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")

    if(username === "" || password === "") {
        return "Enter a Username and Password"
    }

    const data = await registerUser({username, password})
    
    if(data.message) {
        alert(data.message)
        return redirect("/login")
    } else if(data.error){
        return data.error;
    }
}

const Register = () => {
    const errorMessage = useActionData();

    return (
        <div className="login-container">
            <h2 className="login-title">Register</h2>
            {errorMessage ? <p className="red">{errorMessage}</p> : <p className="hidden-error">Failed</p>}
            

            <Form data-testid="login-form" className="login-form" method="post" replace>
                <input data-testid="username-field" name="username" type="text" placeholder="Username" />

                <input data-testid="password-field" name="password" type="text" placeholder="Password" />

                <button data-testid="login-btn" className="login-btn">Create account</button>
            </Form>

            <p className="link-text">Already have an account? Sign in <span className="link-text-span"><Link to="/login">here!</Link></span></p>  
        </div>
    );
}
 
export default Register;