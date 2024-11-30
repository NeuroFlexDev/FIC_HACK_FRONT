import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import "./mainPageStyles.css";
import { Agreements } from "./Agreements";
import { buttonList, cardContentList } from "./lists";


export const MainPage = () => {


  // Создаём массив ссылок (ref) для каждого раздела
  const sectionRefs = useRef(buttonList.map(() => React.createRef()));
  // Функция для прокрутки до определённого элемента
  const scrollToSection = (index) => {
    sectionRefs.current[index].current.scrollIntoView({
      behavior: "smooth", // Плавная прокрутка
      block: "start", // Прокручивает так, чтобы элемент оказался в начале видимой области
    });
  };

  return (
    <div className="main-page-container">
      <div className="main-page">
        <div className="navigation-content">
          <div className="navigation-content-title">
            <h1>Ваш цифровой юрист на каждый день</h1>
            <h3>
              Выберите тип документа и следуйте простым шагам для его создания
            </h3>
          </div>
          <div className="section-buttons-container">
            {buttonList.map((btn, index) => (
              <button
                key={v4()}
                onClick={() => scrollToSection(index)}
                className="section-buttons"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
        {/* Секции для прокрутки */}
        <div style={{ marginTop: "50px" }}>
          {buttonList.map((section, index) => (
            <div
              key={v4()}
              ref={sectionRefs.current[index]} // Привязываем ref
            >
              <h2>{section}</h2>
              <div className="sections-styles">
                <Agreements data={cardContentList[index] || []} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
