"use client";

import { useState } from 'react';
import { signIn, signOut } from "next-auth/react";

// CHANGE: Import Resend and crypto for token generation and email sending
import { Resend } from "resend";
import crypto from "crypto";

// CHANGE: Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export default function RegisterOrLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // CHANGE: Add success state to show verification message
  const [success, setSuccess] = useState<string | null>(null);


  const validateForm = () => {
    // Валідація тільки для реєстрації
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError("Паролі не співпадають");
        return false;
      }

      const nameRegex = /^[A-Za-z0-9]+$/;
      if (!nameRegex.test(formData.nickname) || formData.nickname.length > 20) {
        setError("Нікнейм має містити тільки A-Z, a-z, 0-9 (до 20 символів)");
        return false;
      }

      const passwordRegex = /^[A-Za-z0-9]{8,20}$/;
      if (!passwordRegex.test(formData.password)) {
        setError("Пароль 8-20 символів (A-Z, a-z, 0-9)");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Невірний формат пошти");
      return false;
    }

    return true;
  };


  // CHANGE: Add function to send verification email
  // const sendVerificationEmail = async (email: string, token: string) => {
  //   const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;
  //   await resend.emails.send({
  //     from: process.env.EMAIL_FROM!,
  //     to: email,
  //     subject: "Підтвердіть вашу електронну пошту для NMT Prep",
  //     html: `<p>Натисніть <a href="${verificationUrl}">тут</a>, щоб підтвердити вашу електронну пошту.</p>`,
  //   });
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // CHANGE: Clear success message on new submission
    setSuccess(null);

    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isRegister) {
        // Запит реєстрації
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password,
            // CHANGE: Add verification token to the API request (placeholder for now)
            verificationToken: crypto.randomUUID(), // Will be stored once schema is updated
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Помилка реєстрації");
        }

        // CHANGE: Generate token and send verification email
        const token = crypto.randomUUID();
        // await sendVerificationEmail(formData.email, token);
        // CHANGE: Update success message to inform user about verification
        setSuccess("Реєстрація успішна! Перевірте вашу пошту для підтвердження.");

        alert("Реєстрація успішна! Увійдіть");
        setIsRegister(false);
        setFormData({ nickname: '', email: '', password: '', confirmPassword: '' });

      } else {
        // Тут буде логіка входу (потрібно реалізувати окремий API)
        // CHANGE: Check email verification before login
        // const response = await fetch('/api/users/check', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: formData.email }),
        // });
        //
        // const userData = await response.json();
        //
        // if (!response.ok || !userData.emailVerified) {
        //   setError("Будь ласка, підтвердіть вашу електронну пошту перед входом.");
        //   return;
        // }

        const result = await signIn("credentials", {
          redirect: false, // Prevent NextAuth from redirecting automatically
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError("Невірний email або пароль"); // Show an error message
        } else {
          window.location.href = "/user_profile"; // Redirect to a protected page
        }

        console.log('Логін:', formData);

        return;
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : "Помилка сервера");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex flex-column align-items-center justify-content-center bg-light p-3">
      <div className="container px-4 py-5 bg-white shadow rounded" style={{maxWidth: '500px'}}>
        <h1 className="text-center mb-4 text-primary">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h1>

        {/* CHANGE: Add success message display */}
        {success && (
            <div className="alert alert-success mb-3" role="alert">
              {success}
            </div>
        )}

        {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="w-100">
          {isRegister && (
              <div className="mb-3">
                <label htmlFor="nickname" className="form-label">
                  Нікнейм
                </label>
                <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    className="form-control"
                    placeholder="Тільки латинські літери та цифри"
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
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-control"
                placeholder="example@mail.com"
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
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="form-control"
                placeholder={isRegister ? "8-20 символів (A-Z, a-z, 0-9)" : "Введіть пароль"}
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
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="form-control"
                    placeholder="Повторіть пароль"
                />
              </div>
          )}

          <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : (isRegister ? 'Зареєструватись' : 'Увійти')}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="btn btn-link text-primary"
          >
            {isRegister
                ? 'Вже маєте акаунт? Увійти'
                : 'Немає акаунту? Зареєструватись'}
          </button>
        </div>
        {/*<div className="mt-4 text-center">*/}
        {/*  <h1>Google Sign In</h1>*/}
        {/*  /!* Default NextAuth sign-in button *!/*/}
        {/*  <button*/}
        {/*      onClick={() => signIn("google")}*/}
        {/*      className="btn btn-primary w-100"*/}
        {/*      // className="btn btn-google" // Optional: Add styling classes like bootstrap's 'btn-google' if you want*/}
        {/*  >*/}
        {/*    Sign in with Google*/}
        {/*  </button>*/}
        {/*</div>*/}
        <div className="mt-4 text-center">
          <h1>Sign Out</h1>
          {/* Default NextAuth sign-Out button */}
          <button
              onClick={() => signOut()}
              className="btn btn-primary w-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}