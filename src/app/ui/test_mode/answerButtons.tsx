import { MultipleLettersAnswer } from '../../test_mode/types';

interface AnswerButtonsProps {
  type: 'singleLetter' | 'multipleLetters' | 'number';
  options: string[];
  answer: string | MultipleLettersAnswer;
  correctAnswer: string;
  submitted: boolean;
  onAnswerChange: (newAnswer: string | MultipleLettersAnswer) => void;
}

export function AnswerButtons({
  type,
  options,
  answer,
  correctAnswer,
  submitted,
  onAnswerChange
}: AnswerButtonsProps) {
  const renderSingleLetterButtons = () => (
    <div className="d-flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
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
          onClick={() => onAnswerChange(option)}
          disabled={submitted}
          style={{ width: "40px", height: "35px", fontSize: "0.8rem" }}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const renderMultipleLetterButtons = () => {
    const correctAnswerParsed = JSON.parse(correctAnswer) as MultipleLettersAnswer;
    return (
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
                  onClick={() => onAnswerChange({
                    ...(answer as MultipleLettersAnswer),
                    [key]: option
                  })}
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
    );
  };

const renderNumberInput = () => (
    <div className="input-group mx-auto" style={{ maxWidth: '300px' }}>
      <input
        type="text"
        className={`form-control text-center ${
          submitted ? (isAnswerCorrect(answer, correctAnswer) ? 'is-valid' : 'is-invalid') : ''
        }`}
        value={answer as string}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={submitted}
        placeholder="Введіть число"
      />
    </div>
  );

// , -> .
const normalizeNumber = (value: string | number) => {
    return String(value).replace(',', '.').trim();
};

// Перевірка вводу для числа
const isAnswerCorrect = (answer: string | MultipleLettersAnswer, correctAnswer: string | number) => {
    if (typeof answer !== 'string') return false;
    return normalizeNumber(answer) === normalizeNumber(correctAnswer);
};

  return (
    <>
      {type === 'singleLetter' && renderSingleLetterButtons()}
      {type === 'multipleLetters' && renderMultipleLetterButtons()}
      {type === 'number' && renderNumberInput()}
    </>
  );
}