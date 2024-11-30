import React, { useState } from "react";
import "./AgreementSell.css";
import { sellForm } from "./sellForms";
import { FormField } from "./FormField";

export const AgreementSell = ({ title }) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([]);

  // Обработчик выбора предмета договора
  const handleSubjectSelection = (subject) => {
    setSelectedSubject(subject);
    const updatedFormValues = { ...formValues };

    // Сбрасываем значения старых dynamicFields
    dynamicFields.forEach((field) => {
      delete updatedFormValues[field.id];
    });

    let newFields = [];
    switch (subject) {
      case "Недвижимость":
        newFields = [
          {
            id: "propertyType",
            label: "Тип недвижимости",
            type: "text",
            required: true,
          },
          {
            id: "propertyAddress",
            label: "Адрес недвижимости",
            type: "text",
            required: true,
          },
        ];
        break;
      case "Автомобиль":
        newFields = [
          {
            id: "carBrand",
            label: "Марка автомобиля",
            type: "text",
            required: true,
          },
          {
            id: "carVIN",
            label: "VIN номер автомобиля",
            type: "text",
            required: true,
          },
        ];
        break;
      case "Товары":
        newFields = [
          {
            id: "productType",
            label: "Тип товара",
            type: "text",
            required: true,
          },
          {
            id: "productQuantity",
            label: "Количество товара",
            type: "number",
            required: true,
          },
        ];
        break;
      default:
        newFields = [];
    }

    setFormValues(updatedFormValues);
    setDynamicFields(newFields);
  };

  const handleChange = (e, field, index, subField) => {
    const value = e.target.value;
    const updatedFormValues = { ...formValues };

    if (subField) {
      updatedFormValues[field.id] = updatedFormValues[field.id] || {};
      updatedFormValues[field.id][subField.id] =
        updatedFormValues[field.id][subField.id] || [];
      updatedFormValues[field.id][subField.id][index] = value;
    } else {
      updatedFormValues[field.id] = updatedFormValues[field.id] || [];
      updatedFormValues[field.id][index] = value;
    }

    setFormValues(updatedFormValues);

    // Удаляем ошибку, если значение заполнено
    const errorKey = subField
      ? `${field.id}-${subField.id}-${index}`
      : field.id;
    if (errors[errorKey]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[errorKey];
        return updatedErrors;
      });
    }
  };

  // Проверка формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      alert("Пожалуйста, выберите предмет договора");
      return;
    }

    const newErrors = {};
    const allFields = [...sellForm, ...dynamicFields];

    // Проверка всех полей, включая вложенные
    allFields.forEach((field) => {
      // Проверка обязательных полей (не вложенных)
      if (
        field.required &&
        (!formValues[field.id] || formValues[field.id].length === 0)
      ) {
        newErrors[field.id] = true;
      }

      // Проверка вложенных полей (например, "Стороны договора")
      if (field.parties) {
        field.parties.forEach((party) => {
          const partyValues = formValues[field.id]?.[party.id] || [];
          party.requiredFields.forEach((isRequired, index) => {
            const value = partyValues[index];
            if (isRequired && (!value || value.trim() === "")) {
              newErrors[`${field.id}-${party.id}-${index}`] = true;
            }
          });
        });
      } else if (field.requiredFields) {
        // Проверка обязательных полей внутри поля (например, "Место заключения договора")
        field.requiredFields.forEach((isRequired, index) => {
          const value = formValues[field.id]?.[index];
          if (isRequired && (!value || value.trim() === "")) {
            newErrors[`${field.id}-${index}`] = true;
          }
        });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Устанавливаем ошибки в состоянии
      return;
    }

    console.log("Форма отправлена", formValues);
  };

  return (
    <div className="sell-form-container">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {sellForm.map((field) => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id} className="form-label">
              {field.label}{" "}
              {field.required && <span className="required">*</span>}
            </label>

            {/* Обработка вложенных полей */}
            {field.parties
              ? field.parties.map((subField) => (
                  <div key={subField.id}>
                    <h3>{subField.label}</h3>
                    {Array.from({ length: subField.inputsCount }).map(
                      (_, inputIndex) => (
                        <div key={inputIndex} className="input-group">
                          <input
                            autoComplete="off" // Отключаем автозаполнение
                            type={subField.type}
                            id={`${field.id}-${subField.id}-${inputIndex}`}
                            className={`form-input ${
                              errors[`${field.id}-${subField.id}-${inputIndex}`]
                                ? "input-error"
                                : ""
                            }`}
                            placeholder={`Введите ${subField.placeholders[inputIndex]}`}
                            value={
                              formValues[field.id]?.[subField.id]?.[
                                inputIndex
                              ] || ""
                            }
                            onChange={(e) =>
                              handleChange(e, field, inputIndex, subField)
                            }
                          />
                          {errors[
                            `${field.id}-${subField.id}-${inputIndex}`
                          ] && (
                            <span className="error-message">
                              Поле обязательно для заполнения
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ))
              : Array.from({ length: field.inputsCount }).map(
                  (_, inputIndex) => (
                    <div key={inputIndex} className="input-group">
                      <input
                        autoComplete="off" // Отключаем автозаполнение
                        type={field.type}
                        id={`${field.id}-${inputIndex}`}
                        className={`form-input ${
                          errors[field.id] ? "input-error" : ""
                        }`}
                        placeholder={`Введите ${field.placeholders[inputIndex]}`}
                        value={formValues[field.id]?.[inputIndex] || ""}
                        onChange={(e) => handleChange(e, field, inputIndex)}
                      />
                      {errors[field.id] && (
                        <span className="error-message">
                          Поле обязательно для заполнения
                        </span>
                      )}
                    </div>
                  )
                )}
          </div>
        ))}

        {/* Блок выбора предмета договора */}
        <div className="form-buttons">
          <p className="form-label">Выберите предмет договора:</p>
          {["Недвижимость", "Автомобиль", "Товары"].map((subject) => (
            <button
              type="button"
              key={subject}
              className={`form-button ${
                selectedSubject === subject ? "active" : ""
              }`}
              onClick={() => handleSubjectSelection(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Динамические поля */}
        {dynamicFields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            formValues={formValues}
            errors={errors}
            handleChange={handleChange}
          />
        ))}

        <button type="submit" className="submit-button">
          Отправить
        </button>
      </form>
    </div>
  );
};
