interface ControlButtonsProps {
    onSkip: () => void;
    onSubmit: () => void;
    onShowSolution: () => void;
    submitted: boolean;
    canSubmit: boolean;
    showSolution: boolean;
  }
  
  export function ControlButtons({
    onSkip,
    onSubmit,
    onShowSolution,
    submitted,
    canSubmit,
    showSolution
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
            {submitted ? "Далі" : "Відповісти"}
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