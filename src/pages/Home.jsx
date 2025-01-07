import { useEffect } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import TabMenu from "../TabMenu";
function Home() {
    useEffect(() => {
        document.title = "Jameer's Website";
    }, []);

    const Navigate = useNavigate();
    const handleButtonClick1 = () => (
        link
    );

    return (
        <div className="home-container">
        
            <h1 className="home-titletext">Hi! I'm Jameer </h1>
            <p className="home-biography">
                I'm an upcoming software developer with interest in applications that can study and reduce the effects of climate change,
                <br />
                robotics, and game development.
                <br />
                I also enjoy viewing the world from the perspective of a camera in my free time!
            </p>
            <div className="home-buttons-container">
                <a href="https://www.linkedin.com/in/jameer-gomez-santos-9159a1258/" 
                target="_blank" 
                rel="noopener noreferrer">
                <button className="home-buttons" onClick={handleButtonClick1}>Linkedin ⤴  </button>
                </a>    
                <a href="mailto:jameergomezsantos@gmail.com">
                <button className="home-buttons" >Contact ✉️</button>
                </a>
                <button className="home-buttons" onClick={() => Navigate("/Photography")}>Photography 📷</button>
            </div>
            <h2 className="home-titletext">About me</h2>
            <p className="home-subtext">Currently, I am a junior at Brandeis University studying computer science and am located in Cambridge, MA. My interestest in learning how
                <br />to program started when I was a kid playing Roblox, i was facinated by each game I played and would go on to try to make serveral of my own.
                <br />
                <br />Nowadays I have used technologies such as:
            </p>
            <ul className="home-techstack">
                <li>Java</li>
                <li>Python</li>
                <li>JavaScript</li>
                <li>React and React Native</li>
                <li>HTML and CSS</li>
                <li>Lua</li>
                <li>C++</li>
            </ul>
            <p className="home-subtext">In order to create all sorts of cool and different <NavLink to={"/Coding"}>projects!</NavLink></p>
            <div className="image">
            <img src="/IMG_3182.JPG" alt="Me in Puerto Rico" className="home-graduation-image" />
            </div>
            <h2 className="home-titletext">My Experiences</h2>
            <TabMenu />
            <Footer />
        </div>
    );
}

export default Home;
