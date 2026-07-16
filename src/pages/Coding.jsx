function Coding(){

    return(
        <div>
        <h1>Projects:</h1>
            <ul>
                <li>
                    Massachuetts Affordable Housing Forecast Report
                    <ul>
                        <li>
                            While interning with the Community Devlopment Assistance Corporation (CEDAC), I was able to publish a a dataset of the affordablity status for over 1800 affordable housing devlopments in Massachusetts.
                        </li>
                        <li>
                            This data will be used by the City of Boston in order to asses which afordable housing devlopments are at risk of losing their affordability status and will be used to help the city make decisions on how to best allocate resources to preserve affordable housing.
                        </li>
                        <li>
                            {/* This link is a placeholder to be replaced later*/}
                            In addition to this, I also created a public web interface for the dataset that allows users to search for affordable housing devlopments by name, location, and affordability status. The web interface can be found <a href={"https://cedac.github.io/affordable-housing-forecast-report/"}>here</a>.
                        </li>

                    </ul>
                </li>
                <li>
                    Viusal Book Cataloger
                    <ul>
                        <li>
                            Using React Native, I devloped a mobile app that allows staff at the Brandeis Libray to enter book information into the Alma database just by taking a picture of the book's verso page.
                        </li>
                        <li>
                            The app uses Optical Character Reconginition to extract the title, author, ISBN, and publisher information 
                        </li>
                        <li>
                            This app then interacts with the Alma API, which allows the app to send extracted information to directly to the Alma database.
                        </li>
                        <li>
                            The github repository for this project can be found <a href={"https://github.com/Cyiox/Visual-Book-Cataloger-"}>here</a>.
                        </li>
                    </ul>
                </li>
            </ul>

        </div>
    )
}
export default Coding