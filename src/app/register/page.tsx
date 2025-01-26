"use client"; 

import { useState } from 'react';

export default function RegisterOrLogin() {
  const [isRegister, setIsRegister] = useState(false); // Перемикач 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      console.log('Реєстрація:', formData);
    } else {
      console.log('Вхід:', formData);
    }
  };

  return (
    <div className="min-h-screen d-flex flex-column align-items-center justify-content-center bg-light p-3">
      <div className="container px-4 py-5 bg-white shadow rounded" style={{ maxWidth: '500px' }}>
        <h1 className="text-center mb-4 text-primary">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h1>
        <form onSubmit={handleSubmit} className="w-100">
          {isRegister && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Ім'я/Нік
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Введіть ваше ім'я"
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Електронна пошта
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Введіть вашу пошту"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Введіть ваш пароль"
            />
          </div>
          {isRegister && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Повторіть пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Повторіть ваш пароль"
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            {isRegister ? 'Зареєструватись' : 'Увійти'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="btn btn-link text-primary"
          >
            {isRegister
              ? 'Вже маєте акаунт? Увійти'
              : 'Немає акаунту? Зареєструватись'}
          </button>
        </div>
        {!isRegister && (
          <div className="text-center mt-2">
            <button className="btn btn-link text-primary">
              Забув пароль?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
