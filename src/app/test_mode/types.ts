export interface Task {
    id: string;
    answer: string;
    problem: string;
    solution: string;
    title?: string;
    type: string;
  }
  
  export interface MultipleLettersAnswer {
    [key: string]: string;
  }
  
  export type AnswerType = 'singleLetter' | 'multipleLetters' | 'number';

  // Інтерфейс для теми
export interface Topic {
  id: string;
  title: string;
  Task?: Task[];
}

// Інтерфейс для вибраного завдання з його темою
export interface SampledTask {
  task: Task;
  topic: string;
  topicId: string;
  result: number | null;
}