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
    <div className="row justify-content-center mt-3 gap-2">
      <div className="col-auto">
        <button className="btn btn-primary custom-button" onClick={onSkip}>
          Пропустити
        </button>
      </div>
      <div className="col-auto">
        <button 
          className="btn btn-primary custom-button"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {nextButtonText || (submitted ? (isLastTask ? "Завершити" : "Далі") : "Відповісти")}
        </button>
      </div>
      <div className="col-auto">
        <button
          className="btn btn-primary custom-button"
          onClick={onShowSolution}
          disabled={!submitted}
        >
          {showSolution ? "Сховати розв'язок" : "Розв'язок"}
        </button>
      </div>
    </div>
  );
}