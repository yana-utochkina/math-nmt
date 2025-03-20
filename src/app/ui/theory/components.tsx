import React from "react";

interface Theory {
  id: string;
  title: string;
  Theory: { content: string }[];
}

export const LoadingState = () => (
  <p className="text-center fs-4 fw-bold mt-5">Завантаження...</p>
);

export const ErrorState = ({ message }: { message: string }) => (
  <p className="text-center fs-4 fw-bold text-danger mt-5">Помилка: {message}</p>
);

interface TheoryUIProps {
  theory: Theory;
}

export const TheoryUI = ({ theory }: TheoryUIProps) => {
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4 text-primary text-center">{theory.title}</h2>
      
      <div className="space-y-4 w-4/5 mx-auto">
        {theory.Theory.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p className="text-gray-700">{item.content}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-5">
        <a
          href={`/test_mode/${theory.id}`}
          className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
          style={{ height: "100px", width: "300px" }}
        >
          До задач
        </a>
      </div>
    </div>
  );
};