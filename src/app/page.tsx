import EducationalPrograms from "./ui/startPage/gridEducationalPrograms";
import NavigationSection from "./ui/startPage/NavigationCard";

export default function Page() {
  return (
    <>
      {/* Хедер */}
      <header className="bg-white py-5 border-bottom">
        <div className="container px-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="fw-bold display-4 text-primary mb-2">Maths</h1>
              <p className="lead text-dark mb-4">
                онлайн-тести НМТ з математики
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Основна частина з кнопками */}
      <section className="py-5">
        {/* <div className="container px-5">
          <div className="row justify-content-center">
            <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
              <a
                href="#!"
                className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                style={{height: "100px", width: "300px"}}
              >
                Швидкий тест у форматі НМТ
              </a>
            </div>
            <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
              <a
                href="/personal_program"
                className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                style={{height: "100px", width: "300px"}}
              >
                Створити індивідуальну програму
              </a>
            </div>
            <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
              <a
                href="/type_of_problems"
                className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                style={{height: "100px", width: "300px"}}
              >
                Розв’язування задач
              </a>
            </div>
          </div>
        </div> */}
        <NavigationSection />
      </section>

      {/* Секція "Чому обрати нас?" */}
      <section className="py-5">
        <EducationalPrograms />
        {/* <div className="container px-5">
          <h2 className="fw-bolder mb-4 text-center text-primary">Чому обрати нас?</h2>
          <div className="row gx-5 gy-4 justify-content-center">
            <div className="col-md-4">
              <h3 className="h5 fw-bold">Інтерактивні тести</h3>
              <p className="mb-0">Велика кількість тестових завдань, що охоплюють всі теми НМТ</p>
            </div>
            <div className="col-md-4">
              <h3 className="h5 fw-bold">Миттєвий зворотний зв’язок</h3>
              <p className="mb-0">Автоматичне оцінювання результатів та пояснення правильних відповідей</p>
            </div>
            <div className="col-md-4">
              <h3 className="h5 fw-bold">Аналіз прогресу</h3>
              <p className="mb-0">Відстеження ваших досягнень та визначення слабких місць</p>
            </div>
            <div className="col-md-4 mt-4">
              <h3 className="h5 fw-bold">Персоналізовані рекомендації</h3>
              <p className="mb-0">Пропозиції щодо додаткових тестів на основі ваших результатів</p>
            </div>
            <div className="col-md-4 mt-4">
              <h3 className="h5 fw-bold">Доступність 24/7</h3>
              <p className="mb-0">Навчайтеся у зручний для вас час та з будь-якого місця</p>
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
}
