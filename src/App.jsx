import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { roundState, goalState } from "./atom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const TimerContainer = styled.div`
  font-family: "Arial", sans-serif;
  text-align: center;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 0 auto;
`;

const TimerTitle = styled.h1`
  font-size: 20px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.text};
`;

const TimerDisplay = styled.div`
  font-size: 36px;
  color: ${(props) => props.theme.text};
`;
const TimerBox = styled(motion.div)`
  width: 250px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const TimerDigit = styled(motion.span)`
  font-weight: bold;
`;

const TimerColon = styled.span`
  margin: 0 5px;
`;

const TimerForm = styled.form`
  margin-top: 20px;
`;

const TimerLabel = styled.label`
  margin-right: 5px;
  color: ${(props) => props.theme.text};
`;

const TimerInput = styled.input`
  padding: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 4px;
  font-size: 14px;
  width: 40px;
`;

const TimerButton = styled(motion.button)`
  padding: 8px 15px;
  margin-top: 10px;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: #b71c1c;
  }
`;

const TimerInfo = styled.div`
  margin-top: 20px;
`;

const TimerInfoText = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const SettingsContainer = styled.div`
  margin-top: 20px;
`;

const SettingsButton = styled.button`
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    background-color: #1b5e20;
  }
`;
function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [round, setRound] = useRecoilState(roundState);
  const [goal, setGoal] = useRecoilState(goalState);
  const [showSettings, setShowSettings] = useState(false);

  const MAX_ROUND = 4;
  const MAX_GOAL = 12;

  useEffect(() => {
    let timer;
    if (isActive) {
      if (minutes > 0 || seconds > 0) {
        timer = setInterval(() => {
          if (seconds === 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          } else {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);
      } else {
        if (round < MAX_ROUND) {
          setRound((prevRound) => prevRound + 1);
          setMinutes(initialMinutes);
          setSeconds(initialSeconds);
        } else if (goal < MAX_GOAL) {
          setGoal((prevGoal) => prevGoal + 1);
          setRound(0);
          setMinutes(initialMinutes);
          setSeconds(initialSeconds);
        }
      }
    }
    return () => clearInterval(timer);
  }, [
    isActive,
    minutes,
    seconds,
    round,
    goal,
    initialMinutes,
    initialSeconds,
    setRound,
    setGoal,
  ]);

  const handleinitialPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
    setRound(0);
    setGoal(0);
    setIsActive(false);
  };

  const onSubmit = (data) => {
    setInitialMinutes(parseInt(data.minutes, 10));
    setInitialSeconds(parseInt(data.seconds, 10));
    setMinutes(parseInt(data.minutes, 10));
    setSeconds(parseInt(data.seconds, 10));
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const digitVars = {
    initial: { opacity: 0 },
    visible: { opacity: 1 },
    leaving: { opacity: 0 },
  };

  const boxVars = {
    initial: { scale: 0 },
    visible: { scale: 1 },
    leaving: { scale: 0, y: 20 },
  };

  const btnPlayVars = {
    hover: { scale: 2 },
    click: { rotateZ: 180 },
  };

  const btnResetVars = {
    hover: { scale: 1.5, borderRadius: "100px" },
    click: { rotateZ: 90 },
  };

  return (
    <TimerContainer>
      <TimerTitle>Pomodoro</TimerTitle>
      <TimerDisplay>
        <AnimatePresence>
          <TimerBox
            key={minutes}
            variants={boxVars}
            initial="initial"
            animate="visible"
          >
            <TimerDigit>{minutes}</TimerDigit>
          </TimerBox>
        </AnimatePresence>
        <TimerColon>:</TimerColon>
        <AnimatePresence>
          <TimerBox
            key={seconds}
            variants={boxVars}
            initial="initial"
            animate="visible"
          >
            <TimerDigit>{seconds < 10 ? `0${seconds}` : seconds}</TimerDigit>
          </TimerBox>
        </AnimatePresence>
      </TimerDisplay>
      <TimerForm onSubmit={handleSubmit(onSubmit)}>
        <SettingsContainer>
          <div>
            <SettingsButton type="button" onClick={toggleSettings}>
              ⚙️
            </SettingsButton>
          </div>
          {showSettings && (
            <div>
              <TimerInput
                type="text"
                {...register("minutes", {
                  required: "분을 입력하세요.",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "숫자만 입력하세요.",
                  },
                })}
              />
              <TimerLabel>:</TimerLabel>
              {errors.minutes && <p>{errors.minutes.message}</p>}
              <TimerInput
                type="text"
                {...register("seconds", {
                  required: "초를 입력하세요.",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "숫자만 입력하세요.",
                  },
                })}
              />
              {errors.seconds && <p>{errors.seconds.message}</p>}
              <TimerButton type="submit">설정</TimerButton>
            </div>
          )}
        </SettingsContainer>
      </TimerForm>
      <div>
        <TimerButton
          onClick={handleinitialPause}
          variants={btnPlayVars}
          whileHover="hover"
          whileTap="click"
        >
          {isActive ? "⏸️" : "▶️"}
        </TimerButton>
        <TimerButton
          onClick={handleReset}
          variants={btnResetVars}
          whileHover="hover"
          whileTap="click"
        >
          🔄️
        </TimerButton>
      </div>
      <TimerInfo>
        <TimerInfoText>
          Round: {round} / {MAX_ROUND}
        </TimerInfoText>
        <TimerInfoText>
          Goal: {goal} / {MAX_GOAL}
        </TimerInfoText>
      </TimerInfo>
    </TimerContainer>
  );
}

export default App;
