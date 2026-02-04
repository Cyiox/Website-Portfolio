import { useState, useEffect} from "react";
import PropTypes from 'prop-types';
import '../pages/PhotographyStyles.css'

function PictureCarousel({ imageArray }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);


    useEffect(() => {
        const rotateInterval =  setInterval(() => {
            setPrevIndex(imageIndex);
            setImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
        }, 5000);
        return () => clearInterval(rotateInterval);
    }, [imageIndex,imageArray.length]);
    return (
        <div className= 'carousel-container'>
                 {prevIndex !== null && (
                     <img src={imageArray[prevIndex]}
                          alt = "Prev image in carousel"
                          className='carousel-image'
                          />
                 )}
                <img
                    src = {imageArray[imageIndex]}
                    alt = 'Current image in carousel'
                    className='carousel-image visible'
                    />
        </div>
    )
}
PictureCarousel.propTypes = {
    imageArray: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default PictureCarousel;