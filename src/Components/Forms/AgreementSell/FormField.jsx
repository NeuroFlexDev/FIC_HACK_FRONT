export const FormField = ({ field, formValues, errors, handleChange }) => {
  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label} {field.required && <span className="required">*</span>}
      </label>
      <input
        type={field.type}
        id={field.id}
        className={`form-input ${errors[field.id] ? "input-error" : ""}`}
        placeholder={`Введите ${field.label.toLowerCase()}`}
        value={formValues[field.id] || ""}
        onChange={(e) => handleChange(e, field)}
      />
      {errors[field.id] && (
        <span className="error-message">Поле обязательно для заполнения</span>
      )}
    </div>
  );
};
