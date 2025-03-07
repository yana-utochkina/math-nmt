"use client";
//yep
import Confetti from "react-confetti";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Task, 
  MultipleLettersAnswer, 
} from "../types";
import { 
  getAnswerType,
  checkSingleLetterAnswer,
  checkMultipleLettersAnswer,
  checkNumberAnswer
} from "../utils";
import { TaskImage } from "../../ui/test_mode/taskImage";
import { AnswerButtons } from "../../ui/test_mode/answerButtons";
import { ControlButtons } from "../../ui/test_mode/controlButtons";
import '../style.css';

export default function TestModePage() {
  const params = useParams();
  const topicId = params?.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState<string | MultipleLettersAnswer>("");
  const [isCorrect ,setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const options = ["А", "Б", "В", "Г", "Д"];

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
        
        // Отримуємо title теми
        setTitle(data.title);
        
        // Сортування
        const sortedTasks = [...data.Task].sort((a: Task, b: Task) => {
          // Визначаємо пріоритет типів
          const getTypePriority = (type: string, answer: string) => {
            if (type === "ONE") {
              return /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(answer) ? 1 : 3;
            } else if (type === "MATCH") {
              return 2;
            } else {
              return 4;
            }
          };
          
          const priorityA = getTypePriority(a.type, a.answer);
          const priorityB = getTypePriority(b.type, b.answer);
          
          return priorityA - priorityB;
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

  // Відображення конфеті
  const [numPieces, setNumPieces] = useState(300);
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    if (showConfetti) {
      document.body.style.overflowX = 'hidden';

      setNumPieces(300);
      setOpacity(1);

      timeout1 = setTimeout(() => {
        setOpacity(0);
        timeout2 = setTimeout(() => {
          setNumPieces(0);
          setShowConfetti(false); // Додано скидання стану
        }, 2000);
      }, 2000);

    } else {
      document.body.style.overflowX = 'auto';
    }

    return () => {
      document.body.style.overflowX = 'auto';
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [showConfetti]);

  // Отримання типу поточного завдання та відповідей
  const currentTask = tasks[currentTaskIndex];
  // Ініціалізація відповіді при зміні завдання
  useEffect(() => {
    if (!currentTask) return;
    
    const answerType = getAnswerType(currentTask);
    
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
      const currentAnswer = currentTask.answer;
      const answerType = getAnswerType(currentTask);
      
      let calculatedIsCorrect = false;
      
      switch (answerType) {
        case 'singleLetter':
          calculatedIsCorrect = checkSingleLetterAnswer(answer as string, currentAnswer);
          break;
        case 'multipleLetters': {
          try {
            const correctAnswerParsed = JSON.parse(currentAnswer) as MultipleLettersAnswer;
            calculatedIsCorrect = checkMultipleLettersAnswer(
              answer as MultipleLettersAnswer, 
              correctAnswerParsed
            );
          } catch (e) {
            calculatedIsCorrect = false;
          }
          break;
        }
        case 'number':
          calculatedIsCorrect = checkNumberAnswer(answer as string, currentAnswer);
          break;
      }

      setIsCorrect(calculatedIsCorrect);
      setSubmitted(true);
      if (calculatedIsCorrect) {
        setShowConfetti(true);
      }
    } else {
      handleNextTask();
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!tasks.length) return <p>Завдання не знайдені</p>;

  const answerType = getAnswerType(currentTask);
  const canSubmit = !!answer && 
    (typeof answer !== 'object' || Object.values(answer).some(v => !!v));

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      {showConfetti && (
        <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={numPieces}
          gravity={0.5}
          recycle={false}
          style={{ 
            opacity: opacity, 
            transition: "opacity 2s ease-out",
            pointerEvents: 'none' // Для ігнорування кліків
          }}
        />
      )}
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
            <h4 className="position-absolute start-50 translate-middle-x">
              Тема: {title || "Невідома"}
            </h4>
            <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${tasks.length}`}</h5>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 d-flex flex-column align-items-center text-center">
              {currentTask?.problem && (
                <TaskImage 
                  src={currentTask.problem} 
                  alt="Завдання" 
                />
              )}

              {showSolution && currentTask?.solution && (
                <TaskImage 
                  src={currentTask.solution} 
                  alt="Розв'язок" 
                  width={258}
                  height={172}
                  disableHover={true}
                />
              )}
            </div>
          </div>

          <div className="row justify-content-center mt-2">
            <div className="col-auto">
              <AnswerButtons 
                type={answerType}
                options={options}
                answer={answer}
                correctAnswer={currentTask.answer}
                submitted={submitted}
                onAnswerChange={setAnswer}
              />
            </div>
          </div>

          <ControlButtons 
            onSkip={handleNextTask}
            onSubmit={handleSubmit}
            onShowSolution={() => setShowSolution(!showSolution)}
            submitted={submitted}
            canSubmit={canSubmit}
            showSolution={showSolution}
          />
        </div>
      </main>
    </div>
  );
}

// // сторінка до другого рефакторингу (все в test_mode page)
// "use client";

// import Confetti from "react-confetti";
// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";

// // Інтерфейс для завдання
// interface Task {
//   id: string;
//   answer: string;
//   problem: string;
//   solution?: string;
//   title?: string;
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
//   const [title, setTitle] = useState("");
//   const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
//   const [answer, setAnswer] = useState<string | MultipleLettersAnswer>("");
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showSolution, setShowSolution] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [hovered, setHovered] = useState(false);
  
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

//         // Отримуємо title теми
//         setTitle(data.title);

//         // Оновлена логіка сортування, як у другому прикладі
//         const sortedTasks = [...data.Task].sort((a: Task, b: Task) => {
//           const isSingleLetter = (answer: string) => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(answer);
//           const isObjectOfLetters = (answer: string) => {
//             try {
//               const parsed: { [key: string]: string } = JSON.parse(answer);
//               return Object.values(parsed).every(value => /^[A-Za-zА-Яа-яЄєІіЇїҐґ]$/.test(value));
//             } catch {
//               return false;
//             }
//           };
//           const isNumber = (answer: string) => /^-?\d+(\.\d+)?$/.test(answer);
          
//           // Сортуємо за категоріями
//           if (isSingleLetter(a.answer) && !isSingleLetter(b.answer)) return -1;
//           if (!isSingleLetter(a.answer) && isSingleLetter(b.answer)) return 1;
      
//           if (isObjectOfLetters(a.answer) && !isObjectOfLetters(b.answer)) return -1;
//           if (!isObjectOfLetters(a.answer) && isObjectOfLetters(b.answer)) return 1;
      
//           if (isNumber(a.answer) && !isNumber(b.answer)) return 1;
//           if (!isNumber(a.answer) && isNumber(b.answer)) return -1;
      
//           // Якщо типи однакові, сортуємо алфавітно або числово
//           //return a.answer.localeCompare(b.answer, undefined, { numeric: true });
//           return 0;
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


//   const [numPieces, setNumPieces] = useState(300);
//   const [opacity, setOpacity] = useState(1);
//   // Відображення конфеті
//   useEffect(() => {
//     let timeout1: NodeJS.Timeout;
//     let timeout2: NodeJS.Timeout;

//     if (showConfetti) {
//       document.body.style.overflowX = 'hidden';

//       setNumPieces(300);
//       setOpacity(1);

//       timeout1 = setTimeout(() => {
//         setOpacity(0);
//         timeout2 = setTimeout(() => {
//           setNumPieces(0);
//           setShowConfetti(false); // Додано скидання стану
//         }, 2000);
//       }, 2000);

//     } else {
//       document.body.style.overflowX = 'auto';
//     }

//     return () => {
//       document.body.style.overflowX = 'auto';
//       clearTimeout(timeout1);
//       clearTimeout(timeout2);
//     };
//   }, [showConfetti]);

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
//      {showConfetti && (
//         <Confetti 
//           width={window.innerWidth}
//           height={window.innerHeight}
//           numberOfPieces={numPieces}
//           gravity={0.5}
//           recycle={false}
//           style={{ 
//             opacity: opacity, 
//             transition: "opacity 2s ease-out",
//             pointerEvents: 'none' // Додано для ігнорування кліків
//           }}
//         />
//       )}
//       <main className="flex-grow-1">
//         <div className="container py-4">
//           <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
//             <h4 className="position-absolute start-50 translate-middle-x">
//               Тема: {title || "Невідома"}
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
//                   width={300}
//                   height={200}
//                   //className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`}
//                   // onMouseEnter={() => setHovered(true)}
//                   // onMouseLeave={() => setHovered(false)}
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