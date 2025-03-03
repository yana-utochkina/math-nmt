"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Інтерфейс для завдання
interface Task {
  id: string;
  answer: string;
  problem: string;
  solution?: string;
  title?: string;
  // інші поля за необхідності
}

// Інтерфейс для відповідей з кількома літерами
interface MultipleLettersAnswer {
  [key: string]: string;
}

export default function TestModePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.id as string;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState<string | MultipleLettersAnswer>("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Масив варіантів відповідей для завдань з вибором літери
  const options = ["А", "Б", "В", "Г", "Д"];
  
  // Визначення типу відповіді
  const getAnswerType = (answer: string) => {
    if (/^[А-ЯЄІЇҐа-яєіїґ]$/.test(answer)) return 'singleLetter';
    try {
      const parsed = JSON.parse(answer);
      if (typeof parsed === 'object' && parsed !== null && 
          Object.values(parsed).every((v: any) => /^[А-ЯЄІЇҐа-яєіїґ]$/.test(v))) {
        return 'multipleLetters';
      }
    } catch (e) {}
    return 'number';
  };

  // Завантаження завдань
  useEffect(() => {
    if (!topicId) {
      setError("ID теми не знайдено в URL");
      setLoading(false);
      return;
    }

    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3000/api/topics/${topicId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Статус: ${res.status}`);
        
        const data = await res.json();
        if (!data.Task) throw new Error("Немає завдань");

        // Оновлена логіка сортування, як у другому прикладі
        const sortedTasks = [...data.Task].sort((a: Task, b: Task) => {
          const isSingleLetter = (answer: string) => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(answer);
          const isObjectOfLetters = (answer: string) => {
            try {
              const parsed: { [key: string]: string } = JSON.parse(answer);
              return Object.values(parsed).every(value => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(value));
            } catch {
              return false;
            }
          };
          const isNumber = (answer: string) => /^-?\d+(\.\d+)?$/.test(answer);
          
          // Сортуємо за категоріями
          if (isSingleLetter(a.answer) && !isSingleLetter(b.answer)) return -1;
          if (!isSingleLetter(a.answer) && isSingleLetter(b.answer)) return 1;
      
          if (isObjectOfLetters(a.answer) && !isObjectOfLetters(b.answer)) return -1;
          if (!isObjectOfLetters(a.answer) && isObjectOfLetters(b.answer)) return 1;
      
          if (isNumber(a.answer) && !isNumber(b.answer)) return 1;
          if (!isNumber(a.answer) && isNumber(b.answer)) return -1;
      
          // Якщо типи однакові, сортуємо алфавітно або числово
          return a.answer.localeCompare(b.answer, undefined, { numeric: true });
        });

        setTasks(sortedTasks);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [topicId]);

  // Отримання типу поточного завдання та відповідей - винесено за межі рендеру
  const currentTask = tasks[currentTaskIndex];
  
  // Ініціалізація відповіді при зміні завдання
  useEffect(() => {
    if (!currentTask) return;
    
    const answerType = getAnswerType(currentTask.answer);
    
    if (answerType === 'multipleLetters') {
      try {
        const correctAnswerParsed = JSON.parse(currentTask.answer) as MultipleLettersAnswer;
        const initialAnswer = Object.keys(correctAnswerParsed).reduce(
          (acc, key) => ({ ...acc, [key]: '' }), 
          {} as MultipleLettersAnswer
        );
        setAnswer(initialAnswer);
      } catch (e) {
        setAnswer("");
      }
    } else {
      setAnswer("");
    }
  }, [currentTaskIndex, tasks]);

  // Перехід до наступного завдання
  const handleNextTask = () => {
    setSubmitted(false);
    setShowSolution(false);
    setCurrentTaskIndex(prev => (prev + 1) % tasks.length);
  };

  // Перевірка відповіді
  const handleSubmit = () => {
    if (!submitted && currentTask) {
      let calculatedIsCorrect = false;
      const currentAnswer = currentTask.answer;
      const answerType = getAnswerType(currentAnswer);
      
      switch (answerType) {
        case 'singleLetter':
          calculatedIsCorrect = answer === currentAnswer;
          break;
        case 'multipleLetters': {
          try {
            const correctAnswerParsed = JSON.parse(currentAnswer) as MultipleLettersAnswer;
            calculatedIsCorrect = Object.keys(correctAnswerParsed)
              .every(key => (answer as MultipleLettersAnswer)[key] === correctAnswerParsed[key]);
          } catch (e) {
            calculatedIsCorrect = false;
          }
          break;
        }
        case 'number': {
          const userNum = parseFloat((answer as string).replace(/,/g, '.'));
          const correctNum = parseFloat(currentAnswer);
          calculatedIsCorrect = !isNaN(userNum) && userNum === correctNum;
          break;
        }
      }

      setIsCorrect(calculatedIsCorrect);
      setSubmitted(true);
      if (calculatedIsCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      handleNextTask();
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!tasks.length) return <p>Завдання не знайдені</p>;

  // Обчислення типу відповіді та інших залежних змінних тільки під час рендеру
  const answerType = currentTask ? getAnswerType(currentTask.answer) : 'singleLetter';
  const correctAnswerParsed = 
    answerType === 'multipleLetters' && currentTask?.answer 
      ? JSON.parse(currentTask.answer) as MultipleLettersAnswer 
      : {};

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
            <h4 className="position-absolute start-50 translate-middle-x">
              Тема: {currentTask?.title || "Невідома"}
            </h4>
            <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 d-flex flex-column align-items-center text-center">
              {currentTask?.problem && (
                <img
                  src={`/${currentTask.problem}`}
                  alt="Завдання"
                  width={600}
                  height={400}
                  className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                />
              )}

              {showSolution && currentTask?.solution && (
                <img
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
            <div className="col-auto">
              {answerType === 'singleLetter' && (
                <div className="d-flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option}
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
                      onClick={() => setAnswer(option)}
                      disabled={submitted}
                      style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {answerType === 'multipleLetters' && (
                <div className="d-flex flex-column gap-3">
                  {Object.keys(correctAnswerParsed).map((key) => (
                    <div key={key} className="d-flex align-items-center gap-2">
                      <span className="fw-bold">{key}:</span>
                      <div className="d-flex flex-wrap gap-2">
                        {options.map((option) => (
                          <button
                            key={option}
                            className={`btn answer-button ${
                              submitted
                                ? option === correctAnswerParsed[key]
                                  ? "correct"
                                  : (answer as MultipleLettersAnswer)[key] === option
                                  ? "incorrect"
                                  : ""
                                : (answer as MultipleLettersAnswer)[key] === option
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => setAnswer(prev => ({ ...(prev as MultipleLettersAnswer), [key]: option }))}
                            disabled={submitted}
                            style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {answerType === 'number' && (
                <div className="input-group mx-auto" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    className={`form-control text-center ${
                      submitted ? (isCorrect ? 'is-valid' : 'is-invalid') : ''
                    }`}
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitted}
                    placeholder="Введіть число"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="row justify-content-center mt-3 gap-2">
            <div className="col-auto">
              <button className="btn btn-primary custom-button" onClick={handleNextTask}>
                Пропустити
              </button>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-primary custom-button"
                onClick={handleSubmit}
                disabled={(!answer && !submitted) || (typeof answer === 'object' && Object.values(answer).every(v => !v))}
              >
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
// import { useParams, useRouter } from "next/navigation";

// // Інтерфейс для завдання
// interface Task {
//   id: string;
//   answer: string;
//   problem: string;
//   solution?: string;
//   title?: string;
//   // інші поля за необхідності
// }

// // Інтерфейс для відповідей з кількома літерами
// interface MultipleLettersAnswer {
//   [key: string]: string;
// }

// export default function TestModePage() {
//   const params = useParams();
//   const router = useRouter();
//   const topicId = params?.id as string;
  
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
//   const [answer, setAnswer] = useState<string | MultipleLettersAnswer>("");
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showSolution, setShowSolution] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [hovered, setHovered] = useState(false);
  
//   // Масив варіантів відповідей для завдань з вибором літери
//   const options = ["А", "Б", "В", "Г", "Д"];
  
//   // Визначення типу відповіді
//   const getAnswerType = (answer: string) => {
//     if (/^[А-ЯЄІЇҐа-яєіїґ]$/.test(answer)) return 'singleLetter';
//     try {
//       const parsed = JSON.parse(answer);
//       if (typeof parsed === 'object' && parsed !== null && 
//           Object.values(parsed).every((v: any) => /^[А-ЯЄІЇҐа-яєіїґ]$/.test(v))) {
//         return 'multipleLetters';
//       }
//     } catch (e) {}
//     return 'number';
//   };

//   // Завантаження завдань
//   useEffect(() => {
//     if (!topicId) {
//       setError("ID теми не знайдено в URL");
//       setLoading(false);
//       return;
//     }

//     async function fetchTasks() {
//       try {
//         const res = await fetch(`http://localhost:3000/api/topics/${topicId}`, { cache: "no-store" });
//         if (!res.ok) throw new Error(`Статус: ${res.status}`);
        
//         const data = await res.json();
//         if (!data.Task) throw new Error("Немає завдань");

//         const sortedTasks = [...data.Task].sort((a: Task, b: Task) => {
//           // Логіка сортування
//           return a.answer.localeCompare(b.answer);
//         });

//         setTasks(sortedTasks);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTasks();
//   }, [topicId]);

//   // Отримання типу поточного завдання та відповідей - винесено за межі рендеру
//   const currentTask = tasks[currentTaskIndex];
  
//   // Ініціалізація відповіді при зміні завдання
//   useEffect(() => {
//     if (!currentTask) return;
    
//     const answerType = getAnswerType(currentTask.answer);
    
//     if (answerType === 'multipleLetters') {
//       try {
//         const correctAnswerParsed = JSON.parse(currentTask.answer) as MultipleLettersAnswer;
//         const initialAnswer = Object.keys(correctAnswerParsed).reduce(
//           (acc, key) => ({ ...acc, [key]: '' }), 
//           {} as MultipleLettersAnswer
//         );
//         setAnswer(initialAnswer);
//       } catch (e) {
//         setAnswer("");
//       }
//     } else {
//       setAnswer("");
//     }
//   }, [currentTaskIndex, tasks]);

//   // Перехід до наступного завдання
//   const handleNextTask = () => {
//     setSubmitted(false);
//     setShowSolution(false);
//     setCurrentTaskIndex(prev => (prev + 1) % tasks.length);
//   };

//   // Перевірка відповіді
//   const handleSubmit = () => {
//     if (!submitted && currentTask) {
//       let calculatedIsCorrect = false;
//       const currentAnswer = currentTask.answer;
//       const answerType = getAnswerType(currentAnswer);
      
//       switch (answerType) {
//         case 'singleLetter':
//           calculatedIsCorrect = answer === currentAnswer;
//           break;
//         case 'multipleLetters': {
//           try {
//             const correctAnswerParsed = JSON.parse(currentAnswer) as MultipleLettersAnswer;
//             calculatedIsCorrect = Object.keys(correctAnswerParsed)
//               .every(key => (answer as MultipleLettersAnswer)[key] === correctAnswerParsed[key]);
//           } catch (e) {
//             calculatedIsCorrect = false;
//           }
//           break;
//         }
//         case 'number': {
//           const userNum = parseFloat((answer as string).replace(/,/g, '.'));
//           const correctNum = parseFloat(currentAnswer);
//           calculatedIsCorrect = !isNaN(userNum) && userNum === correctNum;
//           break;
//         }
//       }

//       setIsCorrect(calculatedIsCorrect);
//       setSubmitted(true);
//       if (calculatedIsCorrect) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 3000);
//       }
//     } else {
//       handleNextTask();
//     }
//   };

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>Помилка: {error}</p>;
//   if (!tasks.length) return <p>Завдання не знайдені</p>;

//   // Обчислення типу відповіді та інших залежних змінних тільки під час рендеру
//   const answerType = currentTask ? getAnswerType(currentTask.answer) : 'singleLetter';
//   const correctAnswerParsed = 
//     answerType === 'multipleLetters' && currentTask?.answer 
//       ? JSON.parse(currentTask.answer) as MultipleLettersAnswer 
//       : {};

//   return (
//     <div className="d-flex flex-column justify-content-between min-vh-100">
//       <main className="flex-grow-1">
//         <div className="container py-4">
//           <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
//             <h4 className="position-absolute start-50 translate-middle-x">
//               Тема: {currentTask?.title || "Невідома"}
//             </h4>
//             <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
//           </div>

//           <div className="row justify-content-center">
//             <div className="col-md-8 d-flex flex-column align-items-center text-center">
//               {currentTask?.problem && (
//                 <img
//                   src={`/${currentTask.problem}`}
//                   alt="Завдання"
//                   width={600}
//                   height={400}
//                   className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
//                   onMouseEnter={() => setHovered(true)}
//                   onMouseLeave={() => setHovered(false)}
//                 />
//               )}

//               {showSolution && currentTask?.solution && (
//                 <img
//                   src={`/${currentTask.solution}`}
//                   alt="Розв'язок"
//                   width={600}
//                   height={400}
//                   className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`}
//                   onMouseEnter={() => setHovered(true)}
//                   onMouseLeave={() => setHovered(false)}
//                 />
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-2">
//             <div className="col-auto">
//               {answerType === 'singleLetter' && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {options.map((option) => (
//                     <button
//                       key={option}
//                       className={`btn answer-button ${
//                         submitted
//                           ? option === currentTask.answer
//                             ? "correct"
//                             : option === answer
//                             ? "incorrect"
//                             : ""
//                           : answer === option
//                           ? "selected"
//                           : ""
//                       }`}
//                       onClick={() => setAnswer(option)}
//                       disabled={submitted}
//                       style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {answerType === 'multipleLetters' && (
//                 <div className="d-flex flex-column gap-3">
//                   {Object.keys(correctAnswerParsed).map((key) => (
//                     <div key={key} className="d-flex align-items-center gap-2">
//                       <span className="fw-bold">{key}:</span>
//                       <div className="d-flex flex-wrap gap-2">
//                         {options.map((option) => (
//                           <button
//                             key={option}
//                             className={`btn answer-button ${
//                               submitted
//                                 ? option === correctAnswerParsed[key]
//                                   ? "correct"
//                                   : (answer as MultipleLettersAnswer)[key] === option
//                                   ? "incorrect"
//                                   : ""
//                                 : (answer as MultipleLettersAnswer)[key] === option
//                                 ? "selected"
//                                 : ""
//                             }`}
//                             onClick={() => setAnswer(prev => ({ ...(prev as MultipleLettersAnswer), [key]: option }))}
//                             disabled={submitted}
//                             style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
//                           >
//                             {option}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {answerType === 'number' && (
//                 <div className="input-group mx-auto" style={{ maxWidth: '300px' }}>
//                   <input
//                     type="text"
//                     className={`form-control text-center ${
//                       submitted ? (isCorrect ? 'is-valid' : 'is-invalid') : ''
//                     }`}
//                     value={answer as string}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     disabled={submitted}
//                     placeholder="Введіть число"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-3 gap-2">
//             <div className="col-auto">
//               <button className="btn btn-primary custom-button" onClick={handleNextTask}>
//                 Пропустити
//               </button>
//             </div>
//             <div className="col-auto">
//               <button 
//                 className="btn btn-primary custom-button"
//                 onClick={handleSubmit}
//                 disabled={(!answer && !submitted) || (typeof answer === 'object' && Object.values(answer).every(v => !v))}
//               >
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

////////////////////////////////////////////
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";

// // Інтерфейс для завдання
// interface Task {
//   id: string;
//   answer: string;
//   problem: string;
//   solution?: string;
//   title?: string;
//   // інші поля за необхідності
// }

// // Інтерфейс для відповідей з кількома літерами
// interface MultipleLettersAnswer {
//   [key: string]: string;
// }

// export default function TestModePage() {
//   const params = useParams();
//   const router = useRouter();
//   const topicId = params?.id as string;
  
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
//   const [answer, setAnswer] = useState<string | MultipleLettersAnswer>("");
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showSolution, setShowSolution] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showConfetti, setShowConfetti] = useState(false);
  
//   // Масив варіантів відповідей для завдань з вибором літери
//   const options = ["А", "Б", "В", "Г", "Д"];
  
//   // Визначення типу відповіді
//   const getAnswerType = (answer: string) => {
//     if (/^[А-ЯЄІЇҐа-яєіїґ]$/.test(answer)) return 'singleLetter';
//     try {
//       const parsed = JSON.parse(answer);
//       if (typeof parsed === 'object' && parsed !== null && 
//           Object.values(parsed).every((v: any) => /^[А-ЯЄІЇҐа-яєіїґ]$/.test(v))) {
//         return 'multipleLetters';
//       }
//     } catch (e) {}
//     return 'number';
//   };

//   // Завантаження завдань
//   useEffect(() => {
//     if (!topicId) {
//       setError("ID теми не знайдено в URL");
//       setLoading(false);
//       return;
//     }

//     async function fetchTasks() {
//       try {
//         const res = await fetch(`http://localhost:3000/api/topics/${topicId}`, { cache: "no-store" });
//         if (!res.ok) throw new Error(`Статус: ${res.status}`);
        
//         const data = await res.json();
//         if (!data.Task) throw new Error("Немає завдань");

//         const sortedTasks = [...data.Task].sort((a: Task, b: Task) => {
//           // Логіка сортування
//           return a.answer.localeCompare(b.answer);
//         });

//         setTasks(sortedTasks);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTasks();
//   }, [topicId]);

//   // Отримання типу поточного завдання та відповідей - винесено за межі рендеру
//   const currentTask = tasks[currentTaskIndex];
  
//   // Ініціалізація відповіді при зміні завдання
//   useEffect(() => {
//     if (!currentTask) return;
    
//     const answerType = getAnswerType(currentTask.answer);
    
//     if (answerType === 'multipleLetters') {
//       try {
//         const correctAnswerParsed = JSON.parse(currentTask.answer) as MultipleLettersAnswer;
//         const initialAnswer = Object.keys(correctAnswerParsed).reduce(
//           (acc, key) => ({ ...acc, [key]: '' }), 
//           {} as MultipleLettersAnswer
//         );
//         setAnswer(initialAnswer);
//       } catch (e) {
//         setAnswer("");
//       }
//     } else {
//       setAnswer("");
//     }
//   }, [currentTaskIndex, tasks]);

//   // Перехід до наступного завдання
//   const handleNextTask = () => {
//     setSubmitted(false);
//     setShowSolution(false);
//     setCurrentTaskIndex(prev => (prev + 1) % tasks.length);
//   };

//   // Перевірка відповіді
//   const handleSubmit = () => {
//     if (!submitted && currentTask) {
//       let calculatedIsCorrect = false;
//       const currentAnswer = currentTask.answer;
//       const answerType = getAnswerType(currentAnswer);
      
//       switch (answerType) {
//         case 'singleLetter':
//           calculatedIsCorrect = answer === currentAnswer;
//           break;
//         case 'multipleLetters': {
//           try {
//             const correctAnswerParsed = JSON.parse(currentAnswer) as MultipleLettersAnswer;
//             calculatedIsCorrect = Object.keys(correctAnswerParsed)
//               .every(key => (answer as MultipleLettersAnswer)[key] === correctAnswerParsed[key]);
//           } catch (e) {
//             calculatedIsCorrect = false;
//           }
//           break;
//         }
//         case 'number': {
//           const userNum = parseFloat((answer as string).replace(/,/g, '.'));
//           const correctNum = parseFloat(currentAnswer);
//           calculatedIsCorrect = !isNaN(userNum) && userNum === correctNum;
//           break;
//         }
//       }

//       setIsCorrect(calculatedIsCorrect);
//       setSubmitted(true);
//       if (calculatedIsCorrect) setShowConfetti(true);
//     } else {
//       handleNextTask();
//     }
//   };

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>Помилка: {error}</p>;
//   if (!tasks.length) return <p>Завдання не знайдені</p>;

//   // Обчислення типу відповіді та інших залежних змінних тільки під час рендеру
//   const answerType = currentTask ? getAnswerType(currentTask.answer) : 'singleLetter';
//   const correctAnswerParsed = 
//     answerType === 'multipleLetters' && currentTask?.answer 
//       ? JSON.parse(currentTask.answer) as MultipleLettersAnswer 
//       : {};

//   return (
//     <div className="d-flex flex-column justify-content-between min-vh-100">
//       <main className="flex-grow-1">
//         <div className="container py-4">
//           <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
//             <h4 className="position-absolute start-50 translate-middle-x">
//               Тема: {currentTask?.title || "Невідома"}
//             </h4>
//             <h5>{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
//           </div>

//           <div className="row justify-content-center">
//             <div className="col-md-8 d-flex flex-column align-items-center text-center">
//               {currentTask?.problem && (
//                 <img
//                   src={`/${currentTask.problem}`}
//                   alt="Завдання"
//                   className="img-fluid"
//                 />
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-4">
//             <div className="col-md-8">
//               {answerType === 'singleLetter' && (
//                 <div className="d-flex flex-wrap gap-2 justify-content-center">
//                   {options.map((option) => (
//                     <button
//                       key={option}
//                       className={`btn ${
//                         submitted
//                           ? option === currentTask.answer
//                             ? 'btn-success'
//                             : option === answer
//                             ? 'btn-danger'
//                             : 'btn-outline-secondary'
//                           : answer === option
//                           ? 'btn-primary'
//                           : 'btn-outline-primary'
//                       }`}
//                       onClick={() => setAnswer(option)}
//                       disabled={submitted}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {answerType === 'multipleLetters' && (
//                 <div className="d-flex flex-column gap-3">
//                   {Object.keys(correctAnswerParsed).map((key) => (
//                     <div key={key} className="d-flex align-items-center gap-2">
//                       <span className="fw-bold">{key}:</span>
//                       <div className="d-flex flex-wrap gap-2">
//                         {options.map((option) => (
//                           <button
//                             key={option}
//                             className={`btn ${
//                               submitted
//                                 ? option === correctAnswerParsed[key]
//                                   ? 'btn-success'
//                                   : (answer as MultipleLettersAnswer)[key] === option
//                                   ? 'btn-danger'
//                                   : 'btn-outline-secondary'
//                                 : (answer as MultipleLettersAnswer)[key] === option
//                                 ? 'btn-primary'
//                                 : 'btn-outline-primary'
//                             }`}
//                             onClick={() => setAnswer(prev => ({ ...(prev as MultipleLettersAnswer), [key]: option }))}
//                             disabled={submitted}
//                           >
//                             {option}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {answerType === 'number' && (
//                 <div className="input-group mx-auto" style={{ maxWidth: '300px' }}>
//                   <input
//                     type="text"
//                     className={`form-control text-center ${
//                       submitted ? (isCorrect ? 'is-valid' : 'is-invalid') : ''
//                     }`}
//                     value={answer as string}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     disabled={submitted}
//                     placeholder="Введіть число"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-4 gap-3">
//             <div className="col-auto">
//               <button className="btn btn-secondary" onClick={handleNextTask}>
//                 Пропустити
//               </button>
//             </div>
//             <div className="col-auto">
//               <button 
//                 className={`btn ${submitted ? (isCorrect ? 'btn-success' : 'btn-danger') : 'btn-primary'}`}
//                 onClick={handleSubmit}
//                 disabled={(!answer && !submitted) || (typeof answer === 'object' && Object.values(answer).every(v => !v))}
//               >
//                 {submitted ? (isCorrect ? 'Правильно →' : 'Неправильно →') : 'Відповісти'}
//               </button>
//             </div>
//             <div className="col-auto">
//               <button
//                 className="btn btn-info"
//                 onClick={() => setShowSolution(!showSolution)}
//                 disabled={!submitted}
//               >
//                 {showSolution ? "Сховати розв'язок" : "Показати розв'язок"}
//               </button>
//             </div>
//           </div>

//           {showSolution && currentTask?.solution && (
//             <div className="row justify-content-center mt-4">
//               <div className="col-md-8">
//                 <img
//                   src={`/${currentTask.solution}`}
//                   alt="Розв'язок"
//                   className="img-fluid"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
//////////////////////////////////////////////////////////
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// //import Image from "next/image";

// export default function TestModePage() {
//   const params = useParams(); // Отримуємо параметри з URL
//   const router = useRouter();
  
//   // Отримуємо ID теми з маршруту
//   const topicId = params?.id || params?.topicId;

//   const [showSolution, setShowSolution] = useState(false);
//   const [answer, setAnswer] = useState("");
//   const [hovered, setHovered] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
//   const [error, setError] = useState(null);

//   const options = ["А", "Б", "В", "Г", "Д"];

//   // useEffect(() => {
//   //   let timeoutId;
//   //   if (hovered) {
//   //     timeoutId = setTimeout(() => setHovered(false), 2000);
//   //   }
//   //   return () => clearTimeout(timeoutId);
//   // }, [hovered]);

//   useEffect(() => {
//     // Виводимо параметри для налагодження
//     console.log("Параметри маршруту:", params);
    
//     // Тільки робимо запит, якщо є topicId
//     if (!topicId) {
//       console.error("ID теми не знайдено в URL");
//       setLoading(false);
//       setError("ID теми не знайдено в URL");
//       return;
//     }

//     async function fetchTasks() {
//       try {
//         //console.log(`Завантаження даних для теми з ID: ${topicId}`);
//         const url = `http://localhost:3000/api/topics/${topicId}`;
//         //console.log("URL запиту:", url);
        
//         const res = await fetch(url, { cache: "no-store" });
        
//         if (!res.ok) {
//           throw new Error(`Не вдалося завантажити дані. Статус: ${res.status}`);
//         }
        
//         const data = await res.json();
//         //console.log("Отримані дані:", data);
        
//         if (!data.Task || !Array.isArray(data.Task)) {
//           throw new Error("Неправильний формат даних: відсутній масив Task");
//         }
        
//         if (data.Task.length === 0) {
//           setTasks([]);
//           setError("Завдання не знайдені в отриманих даних");
//           setLoading(false);
//           return;
//         }

//         // Сортування за answer
//         const sortedTasks = [...data.Task].sort((a, b) => {
//           const isSingleLetter = (answer: string) => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(answer); // Одна літера
//           const isObjectOfLetters = (answer: string) => {
//               try {
//                   const parsed: { [key: string]: string } = JSON.parse(answer);
//                   return Object.values(parsed).every(value => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(value)); // Кожне значення - літера
//               } catch {
//                   return false;
//               }
//           };
//           const isNumber = (answer: string) => /^-?\d+(\.\d+)?$/.test(answer); // Число з крапкою
      
//           // Сортуємо за категоріями
//           if (isSingleLetter(a.answer) && !isSingleLetter(b.answer)) return -1;
//           if (!isSingleLetter(a.answer) && isSingleLetter(b.answer)) return 1;
      
//           if (isObjectOfLetters(a.answer) && !isObjectOfLetters(b.answer)) return -1;
//           if (!isObjectOfLetters(a.answer) && isObjectOfLetters(b.answer)) return 1;
      
//           if (isNumber(a.answer) && !isNumber(b.answer)) return 1;
//           if (!isNumber(a.answer) && isNumber(b.answer)) return -1;
      
//           // Якщо типи однакові, сортуємо алфавітно або числово
//           return a.answer.localeCompare(b.answer, undefined, { numeric: true });
//       });

//         //console.log("Відсортовані завдання:", sortedTasks);
//         setTasks(sortedTasks);
//       } catch (error) {
//         console.error("Помилка завантаження завдань:", error);
//         setError(`Помилка: ${error.message}`);
//         setTasks([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTasks();
//   }, [topicId, params]);

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>Помилка: {error}</p>;
//   if (!tasks || tasks.length === 0) return <p>Завдання не знайдені. Перевірте ID теми.</p>;
  
//   const currentTask = tasks[currentTaskIndex];
  
//   const handleAnswerSelect = (option) => {
//     setAnswer(option);
//   };
  
//   const handleNextTask = () => {
//     setAnswer("");
//     setSubmitted(false);
//     setShowSolution(false);
//     setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length);
//   };

//   const handleSubmit = () => {
//     if (!submitted) {
//       setSubmitted(true);
//       if (answer === currentTask.answer) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 3000);
//       }
//     } else {
//       handleNextTask();
//     }
//   };

//   return (
//     <div className="d-flex flex-column justify-content-between min-vh-100">
//       <main className="flex-grow-1">
//         <div className="container py-4">
//           <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
//             <h4 className="position-absolute start-50 translate-middle-x">
//               Тема: {currentTask ? "Дійсні числа" : "Невідома"}
//             </h4>
//             <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
//           </div>
          
//           <div className="row justify-content-center">
//             <div className="col-md-8 d-flex flex-column align-items-center text-center">
//               {currentTask && currentTask.problem ? (
//                 <img//Image
//                   src={`/${currentTask.problem}`}
//                   alt="Завдання"
//                   width={600}
//                   height={400}
//                   className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
//                   onMouseEnter={() => setHovered(true)}
//                   onMouseLeave={() => setHovered(false)}
//                 />
//               ) : (
//                 <p>Зображення завдання відсутнє</p>
//               )}

//               {showSolution && currentTask && currentTask.solution && (
//                 <img//Image
//                   src={`/${currentTask.solution}`}
//                   alt="Розв'язок"
//                   width={600}
//                   height={400}
//                   className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`}
//                   onMouseEnter={() => setHovered(true)}
//                   onMouseLeave={() => setHovered(false)}
//                 />
//               )}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-2">
//             <div className="col-auto d-flex flex-wrap gap-2">
//               {options.map((option, index) => (
//                 <button
//                   key={index}
//                   className={`btn answer-button ${
//                     submitted
//                       ? option === currentTask.answer
//                         ? "correct"
//                         : option === answer
//                         ? "incorrect"
//                         : ""
//                       : answer === option
//                       ? "selected"
//                       : ""
//                   }`}
//                   onClick={() => handleAnswerSelect(option)}
//                   disabled={submitted}
//                   style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="row justify-content-center mt-3 gap-2">
//             <div className="col-auto">
//               <button className="btn btn-primary custom-button" onClick={handleNextTask}>
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
////////////////////////////////////////////////////////////
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