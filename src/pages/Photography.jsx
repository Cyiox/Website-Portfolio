import { useEffect } from 'react';
import PictureCarousel from "../components/PictureCarousel.jsx";

const images = [
    '/Photos/OldSanJuanBuildings.png',
    '/Photos/WedgeHomePage.JPG',
    '/Photos/Voluntering.png',
    '/Photos/Jay.JPG',
    '/Photos/PalmTree.JPG',
    '/Photos/BeachUmbrella.JPG',
    '/Photos/OldCar.JPG'
]

function Photography(){
    useEffect(() => {
        const ogBackgroundColor = document.body.style.backgroundColor;
        const ogMargin = document.body.style.margin;
        const ogPadding = document.body.style.padding;

        document.body.style.backgroundColor = 'rgb(226,155,99)';
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        // Things will return this state when a user leaves this page
        return () => {
            document.body.style.backgroundColor = ogBackgroundColor;
            document.body.style.margin = ogMargin;
            document.body.style.padding = ogPadding;
        }
    }, []);

    return(
        <>
            <div style={{display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '2rem', height: '100vh', boxSizing: 'border-box'  }}>
                 <div style={{flex: 1, paddingRight:  '2rem'}}>
                   <h1 style={{textAlign: "left", color: "mintcream", fontFamily: 'monospace'}}>Every Picture has a story</h1>
                     <h1> What is yours?</h1>
                 </div>
                <div>
                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', height: '100%', width: '160vh', padding: '0'}}>
                        <PictureCarousel imageArray={images}></PictureCarousel>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Photography