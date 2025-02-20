"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Confetti from "react-confetti";

export default function TestModePage() {
  const searchParams = useSearchParams();
  const useCells = searchParams.get("useCells") === "true";
  const correctAnswer = searchParams.get("correctAnswer") || "А";

  const [showSolution, setShowSolution] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const options = ["А", "Б", "В", "Г", "Д"];

  const handleMouseEnter = () => {
    const id = setTimeout(() => setHovered(true), 2000);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setHovered(false);
  };

  const handleSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      if (answer === correctAnswer) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Припиняє конфетті через 3 сек
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between min-vh-100">
      {showConfetti && <Confetti />}
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8 text-center">
              <img 
                src="/images/test_mode_task.jpg" 
                alt="Task" 
                className={`img-fluid task-image ${hovered ? "hovered" : ""}`} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
              />
              {showSolution && (
                <img 
                  src="/images/test_mode_solution.jpg" 
                  alt="Solution" 
                  className={`img-fluid task-image mt-2 ${hovered ? "hovered" : ""}`} 
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave} 
                />
              )}
            </div>
          </div>

          <div className="row justify-content-center mt-2">
            <div className="col-auto d-flex flex-wrap gap-2">
              {useCells &&
                options.map((option, index) => (
                  <button
                    key={index}
                    className={`btn answer-button ${
                      submitted
                        ? option === correctAnswer
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
          </div>

          <div className="row justify-content-center mt-3 gap-2">
            <div className="col-auto">
              <button 
                className="btn btn-primary custom-button skip-button" 
                onClick={() => window.location.reload()}
              >
                Пропустити
              </button>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-primary custom-button"
                onClick={handleSubmit} 
                disabled={!answer && !submitted}
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
