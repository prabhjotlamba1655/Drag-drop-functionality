import React from "react";
import { CardProps } from "./CardPropTypes";

export const Card: React.FC<CardProps> = (props) => {
  const {
    card,
    index,
    handleDragStart,
    handleDrop,
    handleDragOver,
    onClick,
    thumbnails,
  } = props;
  
  return (
    <div
      className="card"
      draggable
      onDragStart={() => handleDragStart(index)}
      onDrop={(event) => handleDrop(event, index)}
      onDragOver={(event) => handleDragOver(event)}
      onClick={onClick}
    >
      <img src={thumbnails[card.type]} alt={card.title} height={300} width={300} />
      <h3>{card.title}</h3>
    </div>
  );
};
