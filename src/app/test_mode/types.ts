export interface Task {
    id: string;
    answer: string;
    problem: string;
    solution?: string;
    title?: string;
  }
  
  export interface MultipleLettersAnswer {
    [key: string]: string;
  }
  
  export type AnswerType = 'singleLetter' | 'multipleLetters' | 'number';