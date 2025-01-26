"use client";

export default function PastNMTPage() {
  const years = [
    { year: 2024, sessions: ["основна сесія", "додаткова сесія", "демоваріант"] },
    { year: 2023, sessions: ["основна сесія", "додаткова сесія", "демоваріант"] },
    { year: 2022, sessions: ["основна сесія", "додаткова сесія", "демоваріант"] },
    { year: 2021, sessions: ["основна сесія", "додаткова сесія", "демоваріант"] },
  ];

  return (
    <div className="container mt-5">
      {/* Заголовок сторінки */}
      <header className="mb-4 text-center">
        <h1 className="fw-bold text-primary">НМТ минулих років</h1>
        <p className="text-muted">
          Оберіть рік і сесію, для проходження тесту.
        </p>
      </header>

      {/* Список років та сесій */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {years.map((yearData) => (
          <div className="col" key={yearData.year}>
            <div
              className="card border-0 shadow-sm p-3 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ height: "100%" }}
            >
              <h2 className="fw-bold text-primary mb-4">{yearData.year}</h2>
              <div className="d-flex flex-column gap-3">
                {yearData.sessions.map((session, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "300px", // Ширина кнопки
                      height: "100px", // Висота кнопки
                      fontSize: "1rem", // Розмір тексту
                    }}
                  >
                    {session}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
