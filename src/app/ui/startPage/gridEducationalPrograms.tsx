import React from "react";

import Image from "next/image";

export default function EducationalPrograms() {
  const programs = [
    {
      title: "Інтерактивні тести",
      description:
        "Велика кількість тестових завдань, що охоплюють всі теми НМТ з математики",
      image: "/images/working-on-test.jpg",
      bgColor: "bg-primary",
      textColor: "text-white",
      type: "primary",
      imagePosition: "right",
      colSpan: 8,
    },
    {
      title: "Миттєвий зворотний зв’язок",
      description:
        "Автоматичне оцінювання результатів та пояснення правильних відповідей",
      image: "/images/end_of_school.png ",
      type: "warning",
      //   bgColor: "bg-warning",
      bgColor: "bg-primary",
      textColor: "text-white",
      colSpan: 4,
    },
    {
      title: "Аналіз прогресу",
      description: "Відстеження ваших досягнень та визначення слабких місць",
      image: "/images/thinking.jpg",
      type: "success",
      //   bgColor: "bg-success",
      bgColor: "bg-primary",
      textColor: "text-white",

      colSpan: 4,
    },
    {
      title: "Персоналізовані рекомендації",
      description:
        "Пропозиції щодо додаткових тестів на основі ваших результатів",
      image: "/images/project.jpg",
      type: "info",
      bgColor: "bg-primary",
      textColor: "text-white",
      imagePosition: "left",
      colSpan: 8,
    },

    {
      title: "Новітні завдання",
      description:
        "Завдяки постійній і активній роботі база завдань завжди розширюється",
      image: "/images/computer.jpg",
      type: "dark",
      bgColor: "bg-primary",
      textColor: "text-white",
      imagePosition: "left",

      colSpan: 12,
    },
  ];

  const renderCardContent = (program) => {
    const imageElement = (
      <div className="relative w-full h-full min-h-[200px]">
        <Image
          src={program.image}
          alt={program.title}
          fill
          style={{objectFit: "cover"}}
          className="rounded"
        />
      </div>
    );

    const textElement = (
      <div className="card-body flex-1">
        <h5 className="card-title fw-bold">{program.title}</h5>
        <p className="card-text">{program.description}</p>
      </div>
    );

    switch (program.imagePosition) {
      case "right":
        return (
          <div className="d-flex flex-column flex-md-row h-100">
            <div className="flex-1 order-2 order-md-1">{textElement}</div>
            <div className="w-full md:w-1/2 h-48 md:h-auto order-1 order-md-2">
              {imageElement}
            </div>
          </div>
        );
      case "left":
        return (
          <div className="d-flex flex-column flex-md-row h-100">
            <div className="w-full md:w-1/2 h-48 md:h-auto">{imageElement}</div>
            <div className="flex-1">{textElement}</div>
          </div>
        );
      case "bottom":
        return (
          <div className="d-flex flex-column h-100">
            {textElement}
            <div className="h-48">{imageElement}</div>
          </div>
        );
      default: // "top"
        return (
          <div className="d-flex flex-column h-100">
            <div className="h-48">{imageElement}</div>
            {textElement}
          </div>
        );
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {programs.map((program, index) => (
          <div key={index} className={`col-12 col-md-${program.colSpan}`}>
            <div
              className={`card h-100 shadow ${program.bgColor} ${program.textColor} 
    transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105`}
            >
              {renderCardContent(program)}
              {/* {program.badge && (
                <span className="position-absolute top-0 end-0 badge bg-primary m-2 z-1">
                  {program.badge}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
