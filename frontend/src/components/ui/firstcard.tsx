// Card.js
import { Link } from 'react-router-dom';

function Card({ background, title, children, actionText, to }) {
  return (
    <article className="first_page_card">
      <div className="first_page_card-background">
        <img src={background} alt="background" />
      </div>
      <div className="first_page_content">
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
      <div className="action-bottom-bar">
        <Link to={to}>
          {actionText}
          <svg xmlns="http://www.w3.org/2000/svg" className="chevron" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 6l6 6l-6 6"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="arrow" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12l14 0"></path>
            <path d="M15 16l4 -4"></path>
            <path d="M15 8l4 4"></path>
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default Card;
