import React from "react"
import { Form, Link, redirect, useActionData, useNavigate } from "react-router-dom"
import { loginUser } from "../service/authService"
import parseJwt from "../service/jwtService"

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")

    try{
        const data = await loginUser({username, password});
        sessionStorage.setItem("AuthToken", data.accessToken)
        
        const decoded = parseJwt(data.accessToken)
        if(decoded.role === "ADMIN") {
            return redirect("/admin");
        } else {
            return redirect("/user");
        }
        
    } catch(err) {
        return err.message;
    }
}

const Login = () => {
    const errorMessage = useActionData();
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {errorMessage ? <p data-testid="err-msg" className="red">{errorMessage}</p> : <p className="hidden-error">Failed</p>}

            <Form data-testid="login-form" className="login-form" method="post" replace>
                <input data-testid="username-field" name="username" type="text" placeholder="Username" />

                <input data-testid="password-field" name="password" type="text" placeholder="Password" />

                <button data-testid="login-btn" className="login-btn">Sign in</button>
            </Form>

            <button onClick={() => navigate("/")} className="guest-btn">Proceed as guest user</button>
            <p className="link-text">No account? sign up <span className="link-text-span"><Link to="/register">here!</Link></span></p>  
        </div>
    );
}
 
export default Login;