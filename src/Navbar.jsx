import { Link, NavLink } from "react-router-dom"
import { useState } from 'react'

function NavBar(){


    const [menuOpen, setMenuOpen] = useState(false)


    return(
        <nav>
            <Link to={"/"} className="nametext">Jameer Gomez-Santos</Link>
            <div className="menu" onClick={() => {
                setMenuOpen(!menuOpen)
            }}> 
            <span></span>
            <span></span>
            <span></span>
            </div> 
            <ul className={menuOpen ? "open" : ""}>
                <li>
                <NavLink to={"/Photography"}>Photography Portfolio</NavLink>
                </li>
                <li>
                <NavLink to={"/Coding"}>Coding Portfolio</NavLink>    
                </li>
                <li>
                 <NavLink to={"/Contact"}>Contact Me</NavLink>   
                </li>
            </ul>
        </nav>
    )
}
export default NavBar