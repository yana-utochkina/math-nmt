import React from "react";
import {BrainCircuit, History, FolderTree} from "lucide-react";

const NavigationCard = ({icon: Icon, title, description, href}) => (
  <div className="group relative w-full md:w-96 h-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
    <a href={href} className="absolute inset-0 no-underline">
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 no-underline">
          {title}
        </h3>
        <p className="text-gray-600 text-sm no-underline">{description}</p>
        <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-300 no-underline">
          Розпочати
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </a>
  </div>
);

const NavigationSection = () => {
  const options = [
    {
      icon: FolderTree,
      title: "Задачі за темами",
      description:
        "Оберіть бажану тему для підвищення рівня знань",
      href: "/tasks_by_topics",
    },
    {
      icon: History,
      title: "Минулорічні НМТ",
      description:
        "Ознайомтесь з прикладами тестів минулих років",
      href: "/last_year_nmt",
    },
    {
      icon: BrainCircuit,
      title: "Мої помилки",
      description: "Повторіть завдання в яких ви допустили помилки",
      href: "/my_errors",
    },
  ];

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        {options.map((option, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="group relative w-full h-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
              <a href={option.href} className="absolute inset-0 no-underline">
                <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    <option.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 no-underline">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm no-underline">
                    {option.description}
                  </p>
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-300 no-underline">
                    Розпочати
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationSection;
