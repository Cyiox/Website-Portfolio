import React, {useState} from "react";

function MyComponet(){
    const[name, setName] = useState("default state");
    const[age, setAge] = useState(0);
    
    const incrimentAge = () => {
        setAge(age+1)
    }
    const updateName = () => {
        setName("Spongebob")
    }

    return(
        <div>
            <p>Name: {name}</p>
            <p>age: {age}</p>
            <button className="button" onClick={updateName}>Set Name</button>
            <button className = "button" onClick={incrimentAge}>Increase age</button>
        </div>
    );
}
export default MyComponet