import React from "react";
import { useNavigate } from "react-router-dom";
import { cardContentList } from "./lists";

export const Agreements = ({ sectionIndex }) => {
  const navigate = useNavigate();

  const handleCardClick = (destLink, title) => {
    navigate(destLink, { state: { title } }); // Передача title через state
  };

  const agreements = cardContentList[sectionIndex] || [];

  return (
    <div className="agreements-container">
      {agreements.map((agreement, idx) => (
        <div
          key={idx}
          className="agreements-card"
          onClick={() => handleCardClick(agreement.destLink, agreement.title)} // Обработчик клика
        >
          <h3>{agreement.title}</h3>
          <p>{agreement.description}</p>
        </div>
      ))}
    </div>
  );
};
