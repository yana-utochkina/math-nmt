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