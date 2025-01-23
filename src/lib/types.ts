export type Plan = {
    id?: string,
    hours?: number,
    endDate?: Date,
    userID?: string
};

export type Task = {
    id?: string,
    topicID?: string,
}