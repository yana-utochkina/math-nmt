"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
//import confetti from "canvas-confetti";

export default function TasksPage({ params: paramsPromise }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [params, setParams] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const options = ["А", "Б", "В", "Г", "Д"];

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    }
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3000/api/topics/${params.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Не вдалося завантажити дані");
        const data = await res.json();
        setTasks(data.Task);
      } catch (error) {
        console.error("Помилка завантаження завдань:", error);
        setTasks(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [params]);

  if (loading) return <p>Завантаження...</p>;
  if (!tasks || tasks.length === 0) return notFound();

  const currentTask = tasks[currentTaskIndex];

  const handleAnswerSelect = (option) => {
    setAnswer(option);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (answer === currentTask.answer) {
      //confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNextTask = () => {
    setAnswer("");
    setSubmitted(false);
    setShowSolution(false);
    setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length);
  };

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8 text-center">
              <h5>{currentTask.description}</h5>
              <img 
                src={`/${currentTask.problem}`} 
                alt="Task" 
                className="img-fluid task-image" 
              />
              {showSolution && (
                <img 
                  src={`/${currentTask.solution}`} 
                  alt="Solution" 
                  className="img-fluid task-image mt-2" 
                />
              )}
            </div>
          </div>
          <div className="row justify-content-center mt-2">
            <div className="col-auto d-flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  className={`btn answer-button ${submitted ? (option === currentTask.answer ? 'correct' : option === answer ? 'incorrect' : '') : answer === option ? 'selected' : ''}`}
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
              <button 
                className="btn btn-primary custom-button"
                onClick={handleSubmit} 
                disabled={!answer || submitted}
              >
                {submitted ? "Далі" : "Відповісти"}
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary custom-button" onClick={() => setShowSolution(!showSolution)} disabled={!submitted}>
                {showSolution ? "Сховати розв'язок" : "Розв'язок"}
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-danger custom-button skip-button" onClick={handleNextTask}>
                Пропустити
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
        .answer-button:hover, .answer-button.selected {
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
        .skip-button:hover {
          background-color: #0056b3 !important;
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
