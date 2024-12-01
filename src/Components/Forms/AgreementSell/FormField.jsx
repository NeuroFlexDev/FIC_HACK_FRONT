import React from "react";

export const FormField = ({ field, formValues, errors, handleChange, getInputWidth }) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>

      <div className="input-wrapper">
        {/* Проверка на вложенные поля, если они есть */}
        {Array.from({ length: field.inputsCount }).map((_, inputIndex) => (
          <div key={inputIndex} className="input-group">
           <input
  autoComplete="off"
  type={field.type}
  id={`${field.id}-${inputIndex}`}
  className={`form-input form-input-dynamic ${
    errors[`${field.id}-${inputIndex}`] ? "input-error" : ""
  }`}
  placeholder={`Введите ${field.placeholders[inputIndex]}`}
  value={formValues[field.id]?.[inputIndex] || ""}
  onChange={(e) => handleChange(e, field, inputIndex)}
/>

            {errors[`${field.id}-${inputIndex}`] && (
              <span className="error-message">
                Поле обязательно для заполнения
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};