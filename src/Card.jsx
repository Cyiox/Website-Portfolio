import picture from './assets/png_smoking_girk.png'
function Card(){

    return(
        <div className="card">
            <img className = "card-img" src={picture} alt="Hey me, put a meaningful description of picture here" />
            <h2 className='card-title'>Jameer Gomez</h2>
            <p className='card-text'>Striving to becoming a software devloper</p>
        </div>
    );
}
export default Card