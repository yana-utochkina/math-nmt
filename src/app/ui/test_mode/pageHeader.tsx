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
    <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
      {shouldUseTimer && (
        <div className="position-absolute start-0 d-flex align-items-center">
          <div className="timer-container">
            <h5 className="mb-0">
              <span className="badge bg-primary">
                Час: {formatTime(timeLeft)}
              </span>
            </h5>
          </div>
        </div>
      )}
      <h4 className="position-absolute start-50 translate-middle-x">
        Тема: {title || "Невідома"}
      </h4>
      <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${totalTasks}`}</h5>
    </div>
  );
};