import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { AgreementSell } from "../Forms/AgreementSell/AgreementSell";
import { AgreementRent } from "../Forms/AgreementRent/AgreementRent";
import "./FormsContainer.css"

const formComponents = {
  sell: AgreementSell,
  rent: AgreementRent
  // Добавьте другие компоненты здесь
};

export const FormsContainer = () => {
  const { type } = useParams(); // Получаем параметр из URL
  const location = useLocation();
  const { title } = location.state || {}; // Получаем title из состояния

  // Выбор компонента формы в зависимости от типа
  const FormComponent = formComponents[type] || (() => <p>Форма не найдена</p>);

  return (
    <div className='Form-container'>
      <FormComponent title={title || "Информация о документе"}/> {/* Рендер выбранной формы */}
    </div>
  );
};