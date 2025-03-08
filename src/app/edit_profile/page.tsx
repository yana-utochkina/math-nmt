"use client";

import { useState } from "react";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Оновлення профілю:", formData);
  };

  return (
    <div className="min-h-screen d-flex flex-column align-items-center justify-content-center bg-light p-3">
      <div className="container px-4 py-5 bg-white shadow rounded" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4 text-primary">Редагування профілю</h1>
        <form onSubmit={handleSubmit} className="w-100">
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="changeName"
              checked={changeName}
              onChange={() => setChangeName(!changeName)}
              className="form-check-input"
            />
            <label htmlFor="changeName" className="form-check-label fw-bold">
              {`Змінити ім'я`}
            </label>
          </div>
          {changeName && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">{`Нове ім'я`}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Введіть нове ім'я`}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">Пароль</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Введіть ваш пароль`}
                />
              </div>
            </>
          )}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={() => setChangePassword(!changePassword)}
              className="form-check-input"
            />
            <label htmlFor="changePassword" className="form-check-label fw-bold">
              {`Змінити пароль`}
            </label>
          </div>
          {changePassword && (
            <>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">{`Старий пароль`}</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Введіть ваш старий пароль`}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Новий пароль</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Введіть новий пароль`}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmNewPassword" className="form-label">Повторіть новий пароль</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Повторіть новий пароль`}
                />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary w-100">Оновити профіль</button>
        </form>
      </div>
    </div>
  );
}
