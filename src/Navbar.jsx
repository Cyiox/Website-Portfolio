import { Link, NavLink } from "react-router-dom"

function NavBar(){


    return(
        <nav>
            <Link to={"/Home"} className="nametext">Jameer Gomez-Santos</Link>
            <ul>
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