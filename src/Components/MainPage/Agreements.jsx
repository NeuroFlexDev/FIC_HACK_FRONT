import React from "react";
import { v4 } from "uuid";
import { useNavigate } from "react-router";

export const Agreements = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="agreements-container">
      {data.map((agreement) => (
        <div
          onClick={() => navigate(agreement.destLink)}
          key={v4()}
          className="agreements-card"
        >
          <h3>{agreement.title}</h3>
          <p>{agreement.description}</p>
        </div>
      ))}
    </div>
  );
};
