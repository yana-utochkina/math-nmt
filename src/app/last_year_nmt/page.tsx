"use client";

import Link from "next/link";

export default function PastNMTPage() {
  const years = [
    { year: 2024, sessions: [
      { name: "основна сесія", link: "/test_mode/6a7b3225-93ec-4998-8844-cfb2d319688d" },
      { name: "додаткова сесія", link: "/test_mode/ac05aaa8-02b9-4072-a6dc-a821f8fa5aa6" },
      { name: "демоваріант", link: "/test_mode/c5150373-5656-4b41-b4ae-0aaf501135da" }
    ] },
    { year: 2023, sessions: [
      { name: "основна сесія", link: "/test_mode/66a6f7f2-1920-44e5-ac8f-b17df9ec0c71" },
      { name: "додаткова сесія", link: "/test_mode/68f5727d-12a2-4cbf-93b6-bc1367fbd9fd" },
      { name: "демоваріант", link: "/test_mode/41cd6c69-9735-4b80-94f9-cb83515948c9" }
    ] },
    { year: 2022, sessions: [
      { name: "основна сесія", link: "/test_mode/3a59f843-b695-4442-9e83-befebd428660" },
      { name: "додаткова сесія", link: "/test_mode/236ae29b-1808-49d4-8f12-4c2414dbcf56" },
      { name: "демоваріант", link: "/test_mode/0dba388f-8c79-4883-b561-d1891a972b6c" }
    ] },
    { year: 2021, sessions: [
      { name: "основна сесія", link: "/test_mode/12cc3a7f-297f-463d-a548-e402a6e9870c" },
      { name: "додаткова сесія", link: "/test_mode/cc45fa0a-bb71-4bd2-8991-f9a022a58fb4" },
      { name: "демоваріант", link: "/test_mode/56b53c98-2dc2-45c3-b21f-45a43260c24a" }
    ] }
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
                  <Link
                    key={index}
                    href={session.link}
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      style={{
                        width: "300px", // Ширина кнопки
                        height: "100px", // Висота кнопки
                        fontSize: "1rem", // Розмір тексту
                      }}
                    >
                      {session.name}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}