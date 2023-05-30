import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import parseJwt from "../service/jwtService";


const Header = () => {

    const [ user, setUser ] = useState(sessionStorage.getItem("AuthToken"));

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const authToken = sessionStorage.getItem("AuthToken");
        if(authToken) {
            let currentUser = parseJwt(authToken);
            setUser(currentUser.username)
        }
        
    }, [location])

    function logout() {

        if(user) {
            sessionStorage.removeItem("AuthToken");
            setUser(null);
        }
        
        navigate("/login");
    }

    return ( 
        <header>
            <h1>Bookster website</h1>
            <div className="user-info">
                <p>Browsing as {user ? user : "Guest"}</p>
                <button onClick={logout} className="logout-btn">{ user ? "Sign out" : "Sign in" }</button>
            </div>
        </header>
    );
}
 
export default Header;