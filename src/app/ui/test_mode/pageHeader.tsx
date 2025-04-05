import React from 'react';

export const PageHeader = ({
  title,
  currentTaskIndex,
  totalTasks,
  timeLeft,
  shouldUseTimer,
  formatTime
}) => {
  return (
    <div className="container-fluid px-0 mb-3">
      {/* Заголовок завжди зверху на мобільних пристроях */}
      <div className="row mb-2 text-center">
        <div className="col-12">
          <h4 className="mb-0 fw-bold">Тема: {title || "Невідома"}</h4>
        </div>
      </div>

      {/* Таймер та номер завдання в один ряд */}
      <div className="row align-items-center">
        {shouldUseTimer && (
          <div className="col-6 text-start">
            <h5 className="mb-0 fw-bold">
              <span className="">Час: {formatTime(timeLeft)}</span>
            </h5>
          </div>
        )}
        <div className={`col-${shouldUseTimer ? "6" : "12"} text-${shouldUseTimer ? "end" : "center"}`}>
          <h5 className="mb-0 fw-bold">{`Завдання ${currentTaskIndex + 1} з ${totalTasks}`}</h5>
        </div>
      </div>
    </div>
  );
};