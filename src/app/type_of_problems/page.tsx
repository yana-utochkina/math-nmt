import React from "react";
import { ClipboardList, CalendarDays, AlertTriangle } from "lucide-react";

// Оголошуємо типи для пропсів NavigationCard
interface NavigationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ icon: Icon, title, description, href }) => (
  <div className="group relative w-full md:w-96 h-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
    <a href={href} className="absolute inset-0 no-underline">
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 no-underline">{title}</h3>
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

// Оголошуємо тип для опцій навігації
interface Option {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const ProblemsPage: React.FC = () => {
  const options: Option[] = [
    {
      icon: ClipboardList,
      title: "Задачі за темами",
      description: "Виберіть теми, які хочете вивчати",
      href: "/tasks_by_topics",
    },
    {
      icon: CalendarDays,
      title: "Минулорічні НМТ",
      description: "Спробуйте завдання з минулих тестів",
      href: "/last_year_nmt",
    },
    {
      icon: AlertTriangle,
      title: "Мої помилки",
      description: "Проаналізуйте свої помилки та навчайтесь",
      href: "/test_mode",
    },
  ];

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      <header className="bg-white py-5 border-bottom">
        <div className="container px-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="fw-bold display-4 text-primary mb-4">Розв'язування задач</h1>
              <p className="lead text-dark">Оберіть один із розділів, щоб продовжити</p>
            </div>
          </div>
        </div>
      </header>

      <section className="py-5 flex-grow-1 d-flex align-items-center">
        <div className="container px-5">
          <div className="row g-4 justify-content-center">
            {options.map((option, index) => (
              <div key={index} className="col-12 col-md-4 d-flex justify-content-center">
                <NavigationCard {...option} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProblemsPage;
