"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
//import Image from "next/image";

export default function TestModePage() {
  const params = useParams(); // Отримуємо параметри з URL
  const router = useRouter();
  
  // Отримуємо ID теми з маршруту
  const topicId = params?.id || params?.topicId;

  const [showSolution, setShowSolution] = useState(false);
  const [answer, setAnswer] = useState("");
  const [hovered, setHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [error, setError] = useState(null);

  const options = ["А", "Б", "В", "Г", "Д"];

  // useEffect(() => {
  //   let timeoutId;
  //   if (hovered) {
  //     timeoutId = setTimeout(() => setHovered(false), 2000);
  //   }
  //   return () => clearTimeout(timeoutId);
  // }, [hovered]);

  useEffect(() => {
    // Виводимо параметри для налагодження
    console.log("Параметри маршруту:", params);
    
    // Тільки робимо запит, якщо є topicId
    if (!topicId) {
      console.error("ID теми не знайдено в URL");
      setLoading(false);
      setError("ID теми не знайдено в URL");
      return;
    }

    async function fetchTasks() {
      try {
        //console.log(`Завантаження даних для теми з ID: ${topicId}`);
        const url = `http://localhost:3000/api/topics/${topicId}`;
        //console.log("URL запиту:", url);
        
        const res = await fetch(url, { cache: "no-store" });
        
        if (!res.ok) {
          throw new Error(`Не вдалося завантажити дані. Статус: ${res.status}`);
        }
        
        const data = await res.json();
        //console.log("Отримані дані:", data);
        
        if (!data.Task || !Array.isArray(data.Task)) {
          throw new Error("Неправильний формат даних: відсутній масив Task");
        }
        
        if (data.Task.length === 0) {
          setTasks([]);
          setError("Завдання не знайдені в отриманих даних");
          setLoading(false);
          return;
        }

        // Сортування за description
        // const sortedTasks = [...data.Task].sort((a, b) => 
        //   a.description.localeCompare(b.description)
        // );

        // Сортування за answer
        const sortedTasks = [...data.Task].sort((a, b) => {
          const isSingleLetter = (answer: string) => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(answer);  // Одна літера
          const isMultipleLetters = (answer: string) => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]+$/.test(answer);  // Багато літер
          const isNumber = (answer: string) => /^\d+$/.test(answer);  // Одне число
          const isObjectOfNumbers = (answer: string) => {
              try {
                  const parsed: { [key: string]: string } = JSON.parse(answer);  // Типізуємо як об'єкт
                  return Object.values(parsed).every(value => /^\d+$/.test(value));  // Перевірка, чи всі значення - числа
              } catch {
                  return false;
              }
          };
          const isObjectOfLetters = (answer: string) => {
              try {
                  const parsed: { [key: string]: string } = JSON.parse(answer);  // Типізуємо як об'єкт
                  return Object.values(parsed).every(value => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(value));  // Перевірка, чи всі значення - літери
              } catch {
                  return false;
              }
          };
      
          // Спочатку сортуємо за групами:
          if (isSingleLetter(a.answer) && !isSingleLetter(b.answer)) return -1;
          if (!isSingleLetter(a.answer) && isSingleLetter(b.answer)) return 1;
      
          if (isMultipleLetters(a.answer) && !isMultipleLetters(b.answer)) return -1;
          if (!isMultipleLetters(a.answer) && isMultipleLetters(b.answer)) return 1;
      
          if (isObjectOfLetters(a.answer) && !isObjectOfLetters(b.answer)) return -1; // Об'єкт з літерами йде перед іншими
          if (!isObjectOfLetters(a.answer) && isObjectOfLetters(b.answer)) return 1;
      
          if (isObjectOfNumbers(a.answer) && !isObjectOfNumbers(b.answer)) return -1; // Об'єкт з числами йде перед одним числом
          if (!isObjectOfNumbers(a.answer) && isObjectOfNumbers(b.answer)) return 1;
      
          if (isNumber(a.answer) && !isNumber(b.answer)) return 1; // Одне число йде після двох чисел і багатьох літер
          if (!isNumber(a.answer) && isNumber(b.answer)) return -1;
      
          // Якщо типи однакові, сортуємо алфавітно або числово
          return a.answer.localeCompare(b.answer, undefined, { numeric: true });
      });
        
        //console.log("Відсортовані завдання:", sortedTasks);
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Помилка завантаження завдань:", error);
        setError(`Помилка: ${error.message}`);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [topicId, params]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!tasks || tasks.length === 0) return <p>Завдання не знайдені. Перевірте ID теми.</p>;
  
  const currentTask = tasks[currentTaskIndex];
  
  const handleAnswerSelect = (option) => {
    setAnswer(option);
  };
  
  const handleNextTask = () => {
    setAnswer("");
    setSubmitted(false);
    setShowSolution(false);
    setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length);
  };

  const handleSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      if (answer === currentTask.answer) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      handleNextTask();
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
            <h4 className="position-absolute start-50 translate-middle-x">
              Тема: {currentTask ? "Дійсні числа" : "Невідома"}
            </h4>
            <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-8 d-flex flex-column align-items-center text-center">
              {currentTask && currentTask.problem ? (
                <img//Image
                  src={`/${currentTask.problem}`}
                  alt="Завдання"
                  width={600}
                  height={400}
                  className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                />
              ) : (
                <p>Зображення завдання відсутнє</p>
              )}

              {showSolution && currentTask && currentTask.solution && (
                <img//Image
                  src={`/${currentTask.solution}`}
                  alt="Розв'язок"
                  width={600}
                  height={400}
                  className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                />
              )}
            </div>
          </div>

          <div className="row justify-content-center mt-2">
            <div className="col-auto d-flex flex-wrap gap-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`btn answer-button ${
                    submitted
                      ? option === currentTask.answer
                        ? "correct"
                        : option === answer
                        ? "incorrect"
                        : ""
                      : answer === option
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={submitted}
                  style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="row justify-content-center mt-3 gap-2">
            <div className="col-auto">
              <button className="btn btn-primary custom-button" onClick={handleNextTask}>
                Пропустити
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary custom-button" onClick={handleSubmit} disabled={!answer && !submitted}>
                {submitted ? "Далі" : "Відповісти"}
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary custom-button"
                onClick={() => setShowSolution(!showSolution)}
                disabled={!submitted}
              >
                {showSolution ? "Сховати розв'язок" : "Розв'язок"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .answer-button {
          color: black;
          border: 1px solid #ccc;
          background: white;
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        .answer-button:hover,
        .answer-button.selected {
          background-color: #007bff;
          color: white;
        }
        .answer-button.correct {
          background-color: green !important;
          color: white !important;
        }
        .answer-button.incorrect {
          background-color: red !important;
          color: white !important;
        }
        .custom-button {
          height: 60px;
          width: 200px;
          font-size: 1.2rem;
          border-radius: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          transition: background-color 0.3s ease-in-out;
        }
        .custom-button:hover {
          background-color: #0056b3;
        }
        .task-image {
          transition: transform 1s ease-in-out;
        }
        .task-image.hovered {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// //import Confetti from "react-confetti";
// import Image from "next/image";

// export default function TestModePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const useCells = searchParams.get("useCells") === "true";
//   const correctAnswer = searchParams.get("correctAnswer") || "А";

//   const [showSolution, setShowSolution] = useState(false);
//   const [answer, setAnswer] = useState("");
//   const [hovered, setHovered] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);

//   const options = ["А", "Б", "В", "Г", "Д"];

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     if (hovered) {
//       timeoutId = setTimeout(() => setHovered(false), 2000);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [hovered]);

//   const handleSubmit = () => {
//     if (!submitted) {
//       setSubmitted(true);
//       if (answer === correctAnswer) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 3000);
//       }
//     } else {
//       router.refresh();
//     }
//   };

//   return (
//     <div className="d-flex flex-column justify-content-between min-vh-100">
//       {/* {showConfetti && <Confetti />} */}
//       <main className="flex-grow-1">
//         <div className="container py-4">
//           <div className="row justify-content-center align-items-center">
//             <div className="col-md-8 text-center">
//               <Image
//                 src="/images/test_mode_task.jpg"
//                 alt="Task"
//                 width={600}
//                 height={400}
//                 className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
//                 onMouseEnter={() => setHovered(true)}
//               />
//               {showSolution && (
//                 <Image
//                   src="/images/test_mode_solution.jpg"
//                   alt="Solution"
//                   width={600}
//                   height={400}
//                   className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`}
//                   onMouseEnter={() => setHovered(true)}
//                 />
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-2">
//             <div className="col-auto d-flex flex-wrap gap-2">
//               {useCells &&
//                 options.map((option, index) => (
//                   <button
//                     key={index}
//                     className={`btn answer-button ${
//                       submitted
//                         ? option === correctAnswer
//                           ? "correct"
//                           : option === answer
//                           ? "incorrect"
//                           : ""
//                         : answer === option
//                         ? "selected"
//                         : ""
//                     }`}
//                     onClick={() => setAnswer(option)}
//                     disabled={submitted}
//                     style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
//                   >
//                     {option}
//                   </button>
//                 ))}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-3 gap-2">
//             <div className="col-auto">
//               <button className="btn btn-primary custom-button" onClick={() => router.refresh()}>
//                 Пропустити
//               </button>
//             </div>
//             <div className="col-auto">
//               <button className="btn btn-primary custom-button" onClick={handleSubmit} disabled={!answer && !submitted}>
//                 {submitted ? "Далі" : "Відповісти"}
//               </button>
//             </div>
//             <div className="col-auto">
//               <button
//                 className="btn btn-primary custom-button"
//                 onClick={() => setShowSolution(!showSolution)}
//                 disabled={!submitted}
//               >
//                 {showSolution ? "Сховати розв'язок" : "Розв'язок"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       <style jsx>{`
//         .answer-button {
//           color: black;
//           border: 1px solid #ccc;
//           background: white;
//           transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
//         }
//         .answer-button:hover,
//         .answer-button.selected {
//           background-color: #007bff;
//           color: white;
//         }
//         .answer-button.correct {
//           background-color: green !important;
//           color: white !important;
//         }
//         .answer-button.incorrect {
//           background-color: red !important;
//           color: white !important;
//         }
//         .custom-button {
//           height: 60px;
//           width: 200px;
//           font-size: 1.2rem;
//           border-radius: 10px;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           transition: background-color 0.3s ease-in-out;
//         }
//         .custom-button:hover {
//           background-color: #0056b3;
//         }
//         .task-image {
//           transition: transform 1s ease-in-out;
//         }
//         .task-image.hovered {
//           transform: scale(1.1);
//         }
//       `}</style>
//     </div>
//   );
// }