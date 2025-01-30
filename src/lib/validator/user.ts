export function isValidNickname(nickname: string): boolean {
    const nicknameRegex = /^[A-Za-z0-9]+$/;
    return nickname.length <= 20 && nicknameRegex.test(nickname);
};

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
    const passwordRegex = /^[A-Za-z0-9]+$/;
    return passwordRegex.test(password) && password.length >= 8 && password.length <= 20;
}