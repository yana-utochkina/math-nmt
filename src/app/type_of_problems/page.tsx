export default function ProblemsPage() {
  return (
      <div className="d-flex flex-column justify-content-between min-vh-100">
        {/* Хедер */}
        <header className="bg-white py-5 border-bottom">
          <div className="container px-5 text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 className="fw-bold display-4 text-primary mb-4">Розв'язування задач</h1>
                <p className="lead text-dark">
                  Оберіть один із розділів, щоб продовжити
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Секція з кнопками */}
        <section className="py-5 flex-grow-1 d-flex align-items-center">
          <div className="container px-5">
            <div className="row justify-content-center">
              {/* Перша кнопка */}
              <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
                <a
                  href="/tasks_by_topics"
                  className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                  style={{ height: '100px', width: '300px' }}
                >
                  Задачі за темами
                </a>
              </div>
              {/* Друга кнопка */}
              <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
                <a
                  href="/last_year_nmt"
                  className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                  style={{ height: '100px', width: '300px' }}
                >
                  Минулорічні НМТ
                </a>
              </div>
              {/* Третя кнопка */}
              <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
                <a
                  href="/my_errors"
                  className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                  style={{ height: '100px', width: '300px' }}
                >
                  Мої помилки
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
