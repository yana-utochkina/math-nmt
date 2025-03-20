"use client";

import { useState } from "react";
import Link from "next/link"; // Використовуємо Link для маршрутизації у Next.js

const topics = [
  {
    category: "Алгебра і початки аналізу",
    icon: "📚",
    subtopics: [
      {
        title: "1. Цілі числа і вирази",
        subtasks: [
          { name: "Дійсні числа", link: "/theory/c9dd1da4-d6c4-4e16-bc89-2c6056819d9a" },
          { name: "Відношення та пропорції", link: "/theory/6a08ffc7-3c80-417f-8668-772c20a6b4d1" },
          { name: "Показникові, логарифмічні вирази", link: "/theory/8266d49d-0c0b-45d8-8907-292bfbea7664" },
          { name: "Раціональні, ірраціональні числа", link: "/theory/333132a0-a67b-4aaf-b51d-93d6b3643508" },
        ],
      },
      {
        title: "2. Рівняння, нерівності та їхні системи",
        subtasks: [
          { name: "Лінійні, квадратні, раціональні рівняння та системи рівнянь", link: "/theory/62693fa4-c67d-4285-856d-3f54e4ba0d34" },
          { name: "Ірраціональні, тригонометричні рівняння та системи рівнянь", link: "/theory/4c3bd025-549e-4988-bd4d-c0a3276d30ab" },
          { name: "Показникові, логарифмічні рівняння та системи рівнянь", link: "/theory/4d15f516-fa32-4275-884b-d04812c07278" },
          { name: "Нерівності та системи нерівностей", link: "/theory/6c39550a-957e-4396-9b6b-8a8677f848f4" },
          { name: "Розв’язування задач за допомогою рівнянь і систем рівнянь", link: "/theory/546926d6-91d3-4204-977d-ac06115b4068" },
        ],
      },
      {
        title: "3. Функції",
        subtasks: [
          { name: "Числові послідовності", link: "/theory/7e3bc86b-7156-4144-b4c2-19893850a63f" },
          { name: "Функціональна залежність", link: "/theory/49890498-d372-4742-9cd5-a9257edf259c" },
          { name: "Лінійні та квадратні функції", link: "/theory/26748317-361b-4e43-972f-2c1d68b00c56" },
          { name: "Степеневі, показникові, логарифмічні та тригонометричні функції", link: "/theory/b4c63d53-7045-4755-a72c-09c4c822a0e0" },
          { name: "Похідна функції", link: "/theory/c89b9ed6-3593-4cc8-b06c-3ffc2615c723" },
          { name: "Первісна та визначений інтеграл", link: "/theory/250076e3-b886-4a26-84ac-ede7b970721b" },
        ],
      },
      {
        title: "4. Комбінаторика, теорія ймовірностей, статистика",
        subtasks: [
          { name: "Перестановки, комбінації, розміщення. Комбінаторні правила суми та добутку", link: "/theory/728538d2-0eca-47fe-983b-62441fbec385" },
          { name: "Ймовірність випадкової події. Вибіркові характеристики", link: "/theory/f8c8177a-5cf9-4679-917a-c37f27b7863d" },
        ],
      },
    ],
  },
  {
    category: "Геометрія",
    icon: "📐",
    subtopics: [
      {
        title: "1. Планіметрія",
        subtasks: [
          { name: "Елементарні геометричні фігури на площині. Геометричні величини", link: "/theory/549a1d65-ef57-4a2b-b2c7-801ce61e3a91" },
          { name: "Трикутники", link: "/theory/e0d9f45d-6e71-4366-9c4d-39ca78cad759" },
          { name: "Прямокутні трикутники", link: "/theory/68f27b34-ddce-4a47-84df-7f242054e407" },
          { name: "Паралелограм. Ромб. Трапеція", link: "/theory/4bc83666-29aa-44fb-9122-b7924b3eb6d6" },
          { name: "Прямокутник. Квадрат", link: "/theory/3d7965a8-a998-460d-a881-b00535c0c333" },
          { name: "Коло та круг. Многокутники", link: "/theory/7a819a63-4ded-4280-8f3a-083d3e5686f6" },
          { name: "Координати та вектори на площині. Геометричні переміщення", link: "/theory/881e8c73-a707-40ed-aa68-1dce3b8e83a4" },
        ],
      },
      {
        title: "2. Стереометрія",
        subtasks: [
          { name: "Прямі та площини у просторі", link: "/theory/598042b0-43dd-43ea-b902-85357eb9be44" },
          { name: "Призма", link: "/theory/995c7c9b-343d-4338-ac3b-febea3691ecf" },
          { name: "Піраміда", link: "/theory/fdb166e4-334b-44db-8e75-13b86589ddfa" },
          { name: "Тіла обертання", link: "/theory/7456af1a-def6-4e9a-8997-3facef4ae48e" },
          { name: "Координати та вектори у просторі", link: "/theory/6df95af3-1c9b-42fe-8c01-d864913de592" },
        ],
      },
    ],
  },
];

export default function TopicsPage() {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleTopic = (title: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  return (
    <div className="container-fluid px-0">
      {/* Заголовок сторінки */}
      <header className="mb-4 text-center">
        <h1 className="fw-bold text-primary">Задачі за темами</h1>
        <p className="text-muted">Оберіть тему, щоб отримати теорію та задачі.</p>
      </header>

      {/* Список категорій з адаптивними відступами */}
      <div className="accordion px-2 px-sm-3 px-md-4">
        {topics.map((topic, index) => (
          <div key={index} className="mb-4">
            <h2 className="fw-bold mb-3 text-primary ps-2 ps-sm-3 ps-md-4 ps-lg-5">
              {topic.icon} {topic.category}
            </h2>
            {topic.subtopics.map((subtopic, subIndex) => (
              <div key={subIndex} className="mb-3 ps-3 ps-sm-4 ps-md-5 ps-lg-5">
                <button
                  className="btn btn-link text-dark text-decoration-none fw-bold d-flex align-items-center"
                  onClick={() => toggleTopic(subtopic.title)}
                >
                  <span className="me-2">{expandedTopics[subtopic.title] ? "▾" : "▸"}</span>
                  <span className="text-start">{subtopic.title}</span>
                </button>
                {expandedTopics[subtopic.title] && (
                  <ul className="list-unstyled ps-3 ps-sm-4 mt-2">
                    {subtopic.subtasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="mb-2">
                        <Link href={task.link} className="text-primary text-decoration-none">
                          {task.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
//   return (
//     <div className="container-fluid px-0">
//       {/* Заголовок сторінки */}
//       <header className="mb-4 text-center">
//         <h1 className="fw-bold text-primary">Задачі за темами</h1>
//         <p className="text-muted">Оберіть тему, щоб отримати теорію та задачі.</p>
//       </header>

//       {/* Список категорій */}
//       <div className="accordion mx-4">
//         {topics.map((topic, index) => (
//           <div key={index} className="mb-4">
//             <h2 className="fw-bold mb-3 text-primary" style={{ marginLeft: "100px" }}>
//               {topic.icon} {topic.category}
//             </h2>
//             {topic.subtopics.map((subtopic, subIndex) => (
//               <div key={subIndex} className="mb-3" style={{ marginLeft: "120px" }}>
//                 <button
//                   className="btn btn-link text-dark text-decoration-none fw-bold"
//                   onClick={() => toggleTopic(subtopic.title)}
//                 >
//                   {subtopic.title} {expandedTopics[subtopic.title] ? "▾" : "▸"}
//                 </button>
//                 {expandedTopics[subtopic.title] && (
//                   <ul className="list-unstyled ps-3" style={{ marginLeft: "20px" }}>
//                     {subtopic.subtasks.map((task, taskIndex) => (
//                       <li key={taskIndex} className="mb-2">
//                         <Link href={task.link} className="text-primary text-decoration-none">
//                           {task.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
