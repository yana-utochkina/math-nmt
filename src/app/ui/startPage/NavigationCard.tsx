import React from "react";
import Link from "next/link";
import { Timer, BookOpen, Brain } from "lucide-react";

// Оголошення типу для NavigationCard
interface NavigationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

// Компонент NavigationCard
const NavigationCard: React.FC<NavigationCardProps> = ({ icon: Icon, title, description, href }) => (
  <div className="group relative w-full md:w-96 h-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
    <Link href={href} className="absolute inset-0 no-underline">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  </div>
);

// Компонент NavigationSection
const NavigationSection: React.FC = () => {
  const options = [
    {
      icon: Timer,
      title: "Швидкий тест у форматі НМТ",
      description: "Пройдіть тест для оцінки вашого поточного рівня знань з математики",
      href: "/test_mode?fromPage=/",
    },
    {
      icon: BookOpen,
      title: "Створити індивідуальну програму",
      description: "Отримайте персоналізований план навчання відповідно до ваших цілей",
      href: "/personal_program",
    },
    {
      icon: Brain,
      title: "Розв'язування задач",
      description: "Практикуйтеся на різних типах математичних завдань",
      href: "/type_of_problems",
    },
  ];

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        {options.map((option, index) => (
          <div key={index} className="col-12 col-md-4">
            <NavigationCard
              icon={option.icon}
              title={option.title}
              description={option.description}
              href={option.href}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationSection;
