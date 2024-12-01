import React, { useState } from "react";
import "./AgreementSell.css";
import { sellForm } from "./sellForms";
import { FormField } from "./FormField";

export const AgreementSell = ({ title }) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([]);

  // Функция для вычисления минимальной ширины в зависимости от длины placeholder
  const getInputWidth = (placeholder) => {
    const baseLength = 10; // Базовая длина инпута
    const extraLength = placeholder.length * 0.5; // Дополнительная длина для каждого символа в placeholder
    return Math.max(baseLength + extraLength, 15); // Убедимся, что минимальная ширина 15
  };

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
            id: "propertyData",
            label: "Данные объекта недвижимости",
            type: [
              "text", "text", "text", "text", "number", "number", "number", 
              "number", "selector", "text", "text", "selector",
            ],
            required: true,
            inputsCount: 12,
            placeholders: [
              "Введите город", "Введите район", "Введите улицу", "Номер дома", 
              "Этаж", "Кадастровый номер объекта", "Площадь", "Наличие обременений", 
              "Этажность и характеристика здания", "Налоги и сборы", "Ремонт и состояние объекта", 
              "Документы на право собственности"
            ],
            requiredFields: [
              true, true, true, true, true, true, true, true, true, true, true, true,
            ],
          },
        ];
        break;
      case "Автомобиль":
        newFields = [
          {
            id: "carData",
            label: "Данные автомобиля",
            type: ["text", "number", "text"],
            required: true,
            inputsCount: 3,
            placeholders: ["Марка автомобиля", "Год выпуска автомобиля", "VIN номер автомобиля"],
            requiredFields: [true, true, true],
          },
        ];
        break;
      case "Товары":
        newFields = [
          {
            id: "productData",
            label: "Данные о товарах",
            type: ["text", "number"],
            required: true,
            inputsCount: 2,
            placeholders: ["Тип товара", "Количество товара"],
            requiredFields: [true, true],
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
      : `${field.id}-${index}`;
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
    const allFields = [...sellForm, ...dynamicFields]; // Все поля (статические + динамические)

    allFields.forEach((field) => {
      // Проверка обязательного поля на верхнем уровне
      if (
        field.required &&
        (!formValues[field.id] || formValues[field.id].length === 0)
      ) {
        newErrors[field.id] = true;
      }

      // Проверка вложенных полей (requiredFields)
      if (field.requiredFields) {
        field.requiredFields.forEach((isRequired, index) => {
          const value = formValues[field.id]?.[index];
          if (isRequired && (!value || value.trim() === "")) {
            newErrors[`${field.id}-${index}`] = true;
          }
        });
      }

      // Проверка вложенных структур (например, parties)
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
      }

      // Проверка динамических полей (inputsCount)
      if (field.inputsCount) {
        for (let i = 0; i < field.inputsCount; i++) {
          const value = formValues[field.id]?.[i];
          if (field.requiredFields[i] && (!value || value.trim() === "")) {
            newErrors[`${field.id}-${i}`] = true;
          }
        }
      }
    });

    // Устанавливаем ошибки, если они есть
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Текущие значения формы:", formValues);
      console.log("Найденные ошибки:", newErrors);
      return;
    }

    console.log("Форма успешно отправлена", formValues);
  };

  return (
    <div className="sell-form-container">
       <button className="add-current-doc-btn">Прикрепить существующий документ</button>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {sellForm.map((field) => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id} className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {/* Обработка вложенных полей */}
            {field.parties ? (
              field.parties.map((subField) => (
                <div className="sub-div-container" key={subField.id}>
                  <h3>{subField.label}</h3>
                  <div className="input-wrapper">
                    {Array.from({ length: subField.inputsCount }).map(
                      (_, inputIndex) => (
                        <div key={inputIndex} className="input-group">
                          <input
                            autoComplete="off"
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
                            style={{
                              width: `${getInputWidth(
                                subField.placeholders[inputIndex]
                              )}rem`,
                            }}
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
                </div>
              ))
            ) : (
              <div className="input-wrapper">
                {Array.from({ length: field.inputsCount }).map(
                  (_, inputIndex) => (
                    <div key={inputIndex} className="input-group">
                      <input
                        autoComplete="off"
                        type={field.type}
                        id={`${field.id}-${inputIndex}`}
                        className={`form-input ${
                          errors[`${field.id}-${inputIndex}`] ? "input-error" : ""
                        }`}
                        placeholder={`Введите ${field.placeholders[inputIndex]}`}
                        value={formValues[field.id]?.[inputIndex] || ""}
                        onChange={(e) => handleChange(e, field, inputIndex)}
                        style={{
                          width: `${getInputWidth(
                            field.placeholders[inputIndex]
                          )}rem`,
                        }}
                      />
                      {errors[`${field.id}-${inputIndex}`] && (
                        <span className="error-message">
                          Поле обязательно для заполнения
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Блок выбора предмета договора */}
        <div className="additional-forms">
          <p className="form-label">Выберите предмет договора:</p>
          <div className="form-buttons">
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
        </div>

        {/* Динамические поля */}
        {dynamicFields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            formValues={formValues}
            errors={errors}
            handleChange={handleChange}
            getInputWidth={getInputWidth}
          />
        ))}

        <div className="submit-container">
          <button type="submit" className="submit-button">
            Сгенерировать документ
          </button>
        </div>
      </form>
    </div>
  );
};
