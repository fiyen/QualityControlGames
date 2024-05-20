

function ProdCard({ background, quality }) {
    return (
    <div className="prodcard">
        <div className="prodcard__side">
            <img 
                src={background}
            />
        </div>
        <div className="prodcard__side prodcard__side--back">
            <img
                src={background} 
            />
            <div className="prodcard__text">
                <h1>{quality}</h1>
            </div>
        </div>
    </div>
    )
}

export default ProdCard