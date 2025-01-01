
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home, Photography, Coding, Contact} from './pages'
import NavBar from './Navbar';




function App() {
    return(
      <>
      <BrowserRouter>
        <NavBar />
       <Routes>
        <Route index element = {<Home />} />
        <Route path='/Home' element = {<Home />} />
        <Route path= '/Photography' element = {<Photography />} />
        <Route path='/Coding' element = {<Coding />} />
        <Route path= '/Contact' element = {<Contact />} />
       </Routes>
      </BrowserRouter>
     </>
    );  
}

export default App;
