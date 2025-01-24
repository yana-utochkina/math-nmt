export type Plan = {
    id?: string,
    hours?: number,
    endDate?: Date,
    userID?: string
};

export enum AnswerType {
    ONE,
    MATCH,
    TYPE
};

export type Task = {
    id?: string,
    topicID: string,
    description: string,
    problem: string,
    solution: string,
    type: AnswerType,
    answer: string
};

export type Topic = {
    id?: string,
    parentID: string,
    title: string,
};
