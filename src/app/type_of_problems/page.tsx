import NavigationSection from "../ui/type_of_problems/NavigationCard";

export default function ProblemsPage() {
  return (
      <div className="d-flex flex-column justify-content-between min-vh-100">
        {/* Хедер */}
        <header className="bg-white py-5 border-bottom">
          <div className="container px-5 text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 className="fw-bold display-4 text-primary mb-2">Розв'язування задач</h1>
                <p className="lead text-dark mb-4">
                  Оберіть один із розділів, щоб продовжити
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Секція з кнопками */}
        <section className="py-5">
        <NavigationSection />
        </section>

        {/* Допоміжна секція для коректного відображення основної */}
        <section className="py-5">
        </section>
      </div>
  );
}
