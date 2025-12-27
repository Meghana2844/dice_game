import React, { useState } from "react";
import styled from "styled-components";
import NumberSelector from "./NumberSelector";
import TotalScore from "./TotalScore";
import RollDice from "./RollDice";
import { Button, OutlineButton } from "./styled/button";
import Rules from "./Rules";

const MAX_POINTS = 50; // winning score
const MAX_ROLLS = 10;  // game ends after 10 rolls

const GamePlay = () => {
  const [score, setScore] = useState(0);
  const [selectedNumber, setselectedNumber] = useState(null);
  const [currentDice, setcurrentDice] = useState(4);
  const [error, setError] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [rollCount, setRollCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // UI flags
  const [isRolling, setIsRolling] = useState(false);
  const [lastResultCorrect, setLastResultCorrect] = useState(null);

  const generateRandomNumber = (min, max) => {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const roleDice = () => {
    if (gameOver) return;
    if (!selectedNumber) {
      setError("You have not selected any number");
      return;
    }

    // capture current values for checks inside timeout
    const prevScore = score;
    const prevRollCount = rollCount;

    setError("");
    setIsRolling(true);

    // simulate roll animation duration
    setTimeout(() => {
      const randomNumber = generateRandomNumber(1, 6);
      setcurrentDice(randomNumber);

      const correct = selectedNumber === randomNumber;
      setLastResultCorrect(correct);

      const pointsChange = correct ? randomNumber : -2;
      const newScore = prevScore + pointsChange;
      const newRollCount = prevRollCount + 1;

      // update states
      setScore(newScore);
      setRollCount(newRollCount);
      setRollHistory((prev) => [
        ...prev,
        {
          rollNumber: newRollCount,
          guessed: selectedNumber,
          rolled: randomNumber,
          points: pointsChange,
        },
      ]);
      setselectedNumber(null);

      // check end conditions
      if (newScore >= MAX_POINTS || newRollCount >= MAX_ROLLS) {
        setGameOver(true);
      }

      // fade out the flash after a short time
      setTimeout(() => setLastResultCorrect(null), 900);

      setIsRolling(false);
    }, 800); // animation duration (matches RollDice animation)
  };

  const resetScore = () => {
    setScore(0);
    setRollHistory([]);
    setRollCount(0);
    setGameOver(false);
    setselectedNumber(null);
    setError("");
    setLastResultCorrect(null);
    setIsRolling(false);
  };

  return (
    <MainContainer>
      <div className="top_Section">
        <TotalScore score={score} />
        <NumberSelector
          error={error}
          setError={setError}
          selectedNumber={selectedNumber}
          setselectedNumber={setselectedNumber}
          disabled={isRolling || gameOver}
        />
      </div>

      <RollDice
        currentDice={currentDice}
        roleDice={roleDice}
        isRolling={isRolling}
        lastResultCorrect={lastResultCorrect}
        disabled={isRolling || gameOver}
      />

      {gameOver && (
        <Message success={score >= MAX_POINTS}>
          {score >= MAX_POINTS ? "🎉 You Win!" : "💀 Game Over!"}
        </Message>
      )}

      <div className="btns">
        <OutlineButton onClick={resetScore}>Reset</OutlineButton>
        <Button onClick={() => setShowRules((p) => !p)}>
          {showRules ? "Hide " : "Show "}Rules
        </Button>
      </div>

      {showRules && <Rules />}

      <HistorySection>
        <h3>Roll History</h3>
        <HistoryTable>
          <thead>
            <tr>
              <th>Roll</th>
              <th>Guessed</th>
              <th>Rolled</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rollHistory.length === 0 ? (
              <tr>
                <td colSpan="4">No rolls yet</td>
              </tr>
            ) : (
              rollHistory.map((item) => (
                <tr key={item.rollNumber}>
                  <td>{item.rollNumber}</td>
                  <td>{item.guessed}</td>
                  <td>{item.rolled}</td>
                  <td style={{ color: item.points > 0 ? "green" : "red" }}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </HistoryTable>
      </HistorySection>
    </MainContainer>
  );
};

export default GamePlay;

/* Styled */
const MainContainer = styled.main`
  padding: 24px;
  .top_Section {
    padding-top: 30px;
    display: flex;
    justify-content: space-around;
    align-items: end;
    gap: 20px;
    flex-wrap: wrap;
  }
  .btns {
    margin-top: 18px;
    display: flex;
    gap: 12px;
    justify-content: center;
  }
`;

const Message = styled.p`
  font-size: 28px;
  text-align: center;
  color: ${(p) => (p.success ? "green" : "red")};
  margin-top: 12px;
`;

const HistorySection = styled.section`
  max-width: 900px;
  margin: 20px auto;
  h3 {
    text-align: center;
    margin-bottom: 8px;
  }
`;

const HistoryTable = styled.table`
  margin: 0 auto 40px auto;
  border-collapse: collapse;
  width: 90%;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  th {
    background-color: #f4f4f4;
  }
`;
