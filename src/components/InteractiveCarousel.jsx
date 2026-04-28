import { useState } from 'react';

function InteractiveCarousel({ mediaItems }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    };

    const goPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
    };

    if (!mediaItems || mediaItems.length === 0) return null;

    const currentItem = mediaItems[currentIndex];

    const containerStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        margin: '30px auto',
        textAlign: 'center',
        background: 'linear-gradient(145deg, #112d4e, #3f72af)', /* Added a nice blueish subtle background */
        borderRadius: '12px',
        overflow: 'hidden',
        color: '#fff',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)', /* Stronger shadow to pop out from background */
        border: '1px solid rgba(255,255,255,0.1)'
    };

    const mediaStyle = {
        width: '100%',
        height: '400px',
        objectFit: 'contain',
        display: 'block',
        background: 'rgba(0,0,0,0.4)', /* Slightly translucent backing for different aspect ratios */
        backdropFilter: 'blur(5px)'
    };

    const buttonStyle = {
        position: 'absolute',
        top: '45%', /* Raised slightly to account for the caption */
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%',
        fontSize: '1.5rem',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        transition: 'background 0.2s'
    };

    const captionStyle = {
        padding: '8px 15px', /* Shrinking the caption bar padding */
        margin: 0,
        fontSize: '0.85rem', /* Smaller text */
        background: 'rgba(0, 0, 0, 0.5)', /* Thinner, clean semi-transparent background */
        borderTop: '1px solid rgba(255,255,255,0.05)'
    };

    return (
        <div style={containerStyle}>
            <button
                style={{ ...buttonStyle, left: '10px' }}
                onClick={goPrev}
                onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
            >
                &#10094;
            </button>

            {currentItem.type === 'video' ? (
                <video src={currentItem.src} controls style={mediaStyle} autoPlay muted loop />
            ) : (
                <img src={currentItem.src} alt={currentItem.caption || 'Carousel content'} style={mediaStyle} />
            )}

            <button
                style={{ ...buttonStyle, right: '10px' }}
                onClick={goNext}
                onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
            >
                &#10095;
            </button>

            <div style={captionStyle}>
                <p style={{ margin: 0, padding: '2px 0' }}>
                    <strong>{currentIndex + 1} / {mediaItems.length}</strong>
                    {currentItem.caption && <span style={{ opacity: 0.85 }}> &bull; {currentItem.caption}</span>}
                </p>
            </div>
        </div>
    );
}

export default InteractiveCarousel;