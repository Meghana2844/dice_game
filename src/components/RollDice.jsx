import React from "react";
import styled from "styled-components";

const RollDice = ({ currentDice, roleDice, isRolling, lastResultCorrect, disabled }) => {
  return (
    <DiceContainer
      onClick={!disabled ? roleDice : undefined}
      aria-disabled={disabled}
      result={lastResultCorrect}
      tabIndex={0}
      role="button"
    >
      <div className={`dice ${isRolling ? "rolling" : ""}`}>
        <img
          src={`/images/dice_${currentDice}.png`}
          alt={`dice ${currentDice}`}
          width="120"
          height="120"
        />
      </div>
      <p>{isRolling ? "Rolling..." : disabled ? "Select number to play" : "Click on Dice to roll"}</p>
    </DiceContainer>
  );
};

export default RollDice;

const DiceContainer = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ "aria-disabled": a }) => (a ? "not-allowed" : "pointer")};

  .dice {
    transition: transform 0.2s ease;
    width: 120px;
    height: 120px;
    display: grid;
    place-items: center;
  }

  .rolling {
    animation: shake 0.8s;
  }

  @keyframes shake {
    0% { transform: rotate(0deg); }
    20% { transform: rotate(15deg); }
    40% { transform: rotate(-15deg); }
    60% { transform: rotate(10deg); }
    80% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
  }

  background-color: ${({ result }) =>
    result === true ? "#d4edda" : result === false ? "#f8d7da" : "transparent"};
  border-radius: 12px;
  padding: 12px;
  transition: background-color 0.5s ease;
  user-select: none;
`;
