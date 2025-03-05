// доп функції
import { MultipleLettersAnswer, AnswerType } from './types';

// Визначення типу відповіді
export function getAnswerType(answer: string): AnswerType {
  if (/^[А-ЯЄІЇҐа-яєіїґ]$/.test(answer)) return 'singleLetter';
  try {
    const parsed = JSON.parse(answer);
    if (typeof parsed === 'object' && parsed !== null && 
        Object.values(parsed).every((v: any) => /^[А-ЯЄІЇҐа-яєіїґ]$/.test(v))) {
      return 'multipleLetters';
    }
  } catch (e) {}
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