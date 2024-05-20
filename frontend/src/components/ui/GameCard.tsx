// Card.js
import { Button } from './button'
import { useNavigate } from 'react-router-dom'; // 使用useNavigate替代useHistory

function Card({ background, prodNum, title, description, properties, to, groupName }) {
  const navigate = useNavigate();

  const stepToPage = () => {
    navigate(to, {state: {groupName, title}})
  }

  return (
    <article className="game_card">
        <div className="card__preview">
            <img src={background}/>
            <div className="card__price">
                {prodNum}
            </div>
        </div>
        <div className="card__content">
            <h2 className="card__title">{title}</h2>
            <p className="card__description">
                {description}
            </p>
            <div className="card__bottom">
                <div className="card__properties">
                    {properties}
                </div>
                <Button variant='ghost' onClick={stepToPage} className="card__btn">
                    点击前往
                </Button>
            </div>
        </div>
    </article>
  );
}

export default Card;