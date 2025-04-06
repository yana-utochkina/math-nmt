interface ControlButtonsProps {
  onSkip: () => void;
  onSubmit: () => void;
  onShowSolution: () => void;
  submitted: boolean;
  canSubmit: boolean;
  showSolution: boolean;
  isLastTask?: boolean;
  nextButtonText?: string;
}

export function ControlButtons({
  onSkip,
  onSubmit,
  onShowSolution,
  submitted,
  canSubmit,
  showSolution,
  isLastTask = false,
  nextButtonText
}: ControlButtonsProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 mt-3">

      <div className="order-md-2">
        <button 
          className="btn btn-primary custom-button m-1"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {nextButtonText || (submitted ? (isLastTask ? "Завершити" : "Далі") : "Відповісти")}
        </button>
      </div>
      <div className="order-md-3">
        <button
          className="btn btn-primary custom-button m-1"
          onClick={onShowSolution}
          disabled={!submitted}
        >
          {showSolution ? "Сховати розв'язок" : "Розв'язок"}
        </button>
      </div>
      
      <div className="order-md-1">
        <button className="btn btn-primary custom-button m-1" onClick={onSkip}>
          Пропустити
        </button>
      </div>
    </div>
  );
}