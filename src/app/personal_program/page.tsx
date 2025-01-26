"use client"; // Додаємо директиву для клієнтського компонента

import {useState} from "react";
import "../styles/styles.css";
export default function PersonalPlanPage() {
  const [showCheckbox, setShowCheckbox] = useState(true); // Галочка з'являється, якщо тест не пройдено.
  const [hoursHumber, setHoursNumber] = useState("");
  const [error, setError] = useState<null | string>(null);

  const validateHours = (hours: number) => {
    if (hours < 0 || hours > 168) return "Enter the correct number of hours";
    return null;
  };

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      {/* Хедер */}
      <header className="bg-white py-5 border-bottom">
        <div className="container px-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="lead text-dark mb-4">
                Швидкий тест у форматі НМТ забезпечить вам персоналізований план
                під ваші теперішні знання
              </h2>
              <div className="d-flex justify-content-center mb-3">
                <a
                  href="/quick_test"
                  className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                  style={{
                    height: "100px",
                    width: "300px",
                    fontSize: "1.2rem",
                    textAlign: "center",
                  }}
                >
                  Пройти швидкий тест
                </a>
              </div>

              {/* Чекбокс для пропуску тесту */}
              {showCheckbox && (
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <input
                    type="checkbox"
                    id="skipTest"
                    className="form-check-input"
                  />
                  <label htmlFor="skipTest" className="form-check-label">
                    Відмовляюсь проходити швидкий тест
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Основна частина */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <form className="d-flex flex-column align-items-center">
            {/* Поле для кількості годин */}
            <div className="mb-4 text-center">
              <label
                htmlFor="hours"
                className="lead text-dark d-block mb-2"
                style={{
                  width: "300px",
                  textAlign: "center",
                }}
              >
                Скільки годин на тиждень ви маєте можливість займатись?
              </label>
              <input
                id="hours"
                type="number"
                placeholder={"Введіть кількість годин"}
                value={hoursHumber}
                maxLength={3}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers up to 3 digits
                  if (value === "" || /^[0-9]{0,3}$/.test(value)) {
                    setHoursNumber(value);
                    if (validateHours(Number(value))) {
                      console.log("data", Number(value));
                      setError(validateHours(Number(value)));
                    } else {
                      setError(null);
                    }
                  }
                }}
                className="form-control mx-auto"
                style={{
                  width: "300px",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              />
            </div>
            {error && (
              <div className="text-danger">
                <p>{error}</p>
              </div>
            )}

            {/* Поле для дати завершення */}
            <div className="mb-4 text-center">
              <label
                htmlFor="endDate"
                className="lead text-dark d-block mb-2"
                style={{
                  width: "300px",
                  textAlign: "center",
                }}
              >
                Виберіть дату завершення навчання
              </label>
              <input
                id="endDate"
                type="date"
                placeholder="Оберіть дату"
                className="form-control mx-auto"
                style={{
                  width: "300px",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              />
            </div>

            {/* Кнопка "Створити план" */}
            <button
              disabled={!!error}
              type="submit"
              className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
              style={{
                width: "300px",
                height: "100px",
                fontSize: "1.2rem",
              }}
            >
              Створити план
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
