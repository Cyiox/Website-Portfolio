import { useEffect } from 'react';
import PictureCarousel from "../componets/PictureCarousel.jsx";

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
        document.body.style.backgroundColor = 'rgb(226,155,99)';
        document.body.margin = "0";
        document.body.padding = "0";
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