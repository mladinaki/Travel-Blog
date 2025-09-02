import { Link } from 'react-router-dom';
import kyrgyzstan from '../../../assets/img-1.jpg';
import './About.css'; // добавяме персонален CSS

function About() {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center about-row">
          {/* Снимка */}
          <div className="col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0">
            <img
              src={kyrgyzstan}
              alt="About us"
              className="img-fluid rounded"
            />
          </div>

          {/* Текст */}
          <div className="col text-block flex-column justify-content-center p-4">
            <h2 className="mb-3">За мен!</h2>
            <p className="lead">
              Добре дошли в нашия пътепис блог! <strong>Стиле Травел</strong>
              Тук споделяме нашите приключения, полезни съвети и вдъхновения за
              пътуване.
            </p>
            <p>
              Вярваме, че всяко пътешествие е нова възможност за открития.
              Надяваме се нашите истории да ви мотивират да тръгнете на вашето следващо
              приключение!
            </p>
            <Link to="/blog">
              <button className="btn fas fa-long-arrow-alt-right">
                Към блога <i class="bi bi-arrow-right"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
