/** Layout Component
 * In this component we use outlet to determine which components that render on the screen.
 * Outlet looks at the router path to decide what to render. 
 */

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {

    return ( 
        <div>
            <Header />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
}
 
export default Layout;