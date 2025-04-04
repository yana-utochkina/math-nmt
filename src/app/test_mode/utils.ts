// доп функції
import { Task, MultipleLettersAnswer, AnswerType } from './types';

// Визначення типу відповіді
export function getAnswerType(task: Task): AnswerType {
  if (task.type === "ONE") {
    return /^[А-ЯЄІЇҐа-яєіїґ]$/.test(task.answer) ? 'singleLetter' : 'number';
  } else if (task.type === "MATCH") {
    return 'multipleLetters';
  }
  
  // Якщо тип не розпізнано
  return 'number';
}

// Перевідка відповідей 1 типу
export function checkSingleLetterAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer === correctAnswer;
}

// Перевідка відповідей 2 типу
export function checkMultipleLettersAnswer(
  userAnswer: MultipleLettersAnswer, 
  correctAnswer: MultipleLettersAnswer
): boolean {
  return Object.keys(correctAnswer)
    .every(key => userAnswer[key] === correctAnswer[key]);
}

// Перевідка відповідей 3 типу
export function checkNumberAnswer(userAnswer: string, correctAnswer: string): boolean {
  const userNum = parseFloat(userAnswer.replace(/[,.]/g, '.'));  // , -> .
  const correctNum = parseFloat(correctAnswer.replace(/[,.]/g, '.')); // , -> .
  return !isNaN(userNum) && userNum === correctNum;
}

// Функція для перевірки активації таймера
export const checkIfTimerNeeded = (title: string): boolean => {
  const startsWithNumber = /^\d/.test(title);
  const isQuickTest = title === "Швидкий тест";
  return startsWithNumber || isQuickTest;
};

// Функція для форматування часу
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Функція для розрахунку часу проходження
export const calculateCompletionTime = (startTime: number | null): number => {
  if (!startTime) return 0;
  return Math.floor((Date.now() - startTime) / 1000);
};

// Типи для функції обробки завершення тесту
type TestCompletionParams = {
  startTime: number | null;
  shouldUseTimer: boolean;
  topicId: string;
  results: { correct: number; total: number };
  router: any;
};

// Функція обробки завершення тесту
export const handleTestCompletion = ({
  startTime,
  shouldUseTimer,
  topicId,
  results,
  router
}: TestCompletionParams): void => {
  const completionTime = calculateCompletionTime(startTime);
  const timeParam = shouldUseTimer ? `&time=${completionTime}` : '';
  router.push(
    `/result_page?topicId=${topicId}&correct=${results.correct}&total=${results.total}${timeParam}`
  );
};

type QuickTestCompletionParams = {
  results: { correct: number; total: number };
  router: any;
};

export const handleQuickTestCompletion = ({
  results,
  router
}: QuickTestCompletionParams): void => {
  const timeParam = '';
  const topicId = '716cb5d6-a58b-4b29-b219-ac7e18118cda';
  router.push(
    `/result_page?topicId=${topicId}&correct=${results.correct}&total=${results.total}${timeParam}`
  );
};