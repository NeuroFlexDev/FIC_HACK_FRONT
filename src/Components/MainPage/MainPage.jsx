import React, { useRef } from "react";
import { v4 } from "uuid";
import "./mainPageStyles.css";
import { Agreements } from "./Agreements";
import { buttonList } from "./lists";

export const MainPage = () => {
  const sectionRefs = useRef(buttonList.map(() => React.createRef()));

  const scrollToSection = (index) => {
    sectionRefs.current[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
        <div className="form-list-cards" style={{ marginTop: "50px" }}>
          {buttonList.map((section, index) => (
            <div key={v4()} ref={sectionRefs.current[index]}>
              <h2>{section}</h2>
              <div className="sections-styles">
                <Agreements sectionIndex={index} /> {/* Передаём индекс */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
