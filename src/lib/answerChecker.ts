import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "questions.json");

// Завантажуємо JSON-файл
export const getQuestions = (): any[] => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
};

// Перевірка відповіді користувача
export const validateAnswer = (questionId: string, userAnswer: any): boolean => {
    const questions = getQuestions();
    const question = questions.find(q => q.id === questionId);

    if (!question) return false;

    switch (question.type) {
        case "single-choice":
            return userAnswer === question.answer;

        case "matching":
            return JSON.stringify(userAnswer.sort()) === JSON.stringify(question.answer.sort());

        case "numeric":
            return Number(userAnswer) === question.answer;

        default:
            return false;
    }
};
