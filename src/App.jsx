
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import {Home, Photography, Coding, Contact,Wedgina, CardRoulete} from './pages'
import NavBar from './Navbar';

function AppContent(){

    const currentPath = useLocation();
    // Returns true if the user is currently on photography page
    const hideNavBar = currentPath.pathname === '/Photography'
    return(
        <>
            {/* The line below is a if statement. It says hideNavBar is false, return NavBar, else return null */}
            {!hideNavBar ? <NavBar /> : null}
                <Routes>
                    <Route index element = {<Home />} />
                    <Route path='/Home' element = {<Home />} />
                    <Route path= '/Photography' element = {<Photography />} />
                    <Route path='/Coding' element = {<Coding />} />
                    <Route path= '/Contact' element = {<Contact />} />
                    <Route path= '/Wedgina' element = {<Wedgina />} />
                    <Route path = '/CardRoulete' element = {<CardRoulette/>}/>
                </Routes>
        </>
    );
}




function App() {
    return (
        <BrowserRouter>
            <AppContent/>
        </BrowserRouter>
    );
}

export default App;
