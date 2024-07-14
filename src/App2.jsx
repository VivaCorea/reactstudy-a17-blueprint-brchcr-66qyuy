import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { roundState, goalState } from "./atom";
import { useForm } from "react-hook-form";
import styled from "styled-components";

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

const TimerDigit = styled.span`
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

const TimerButton = styled.button`
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

const MAX_ROUND = 4;
const MAX_GOAL = 12;

function App2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [initialMinutes, setInitialMinutes] = useState(25); // 초기 분
  const [initialSeconds, setInitialSeconds] = useState(0); // 초기 초
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [round, setRound] = useRecoilState(roundState);
  const [goal, setGoal] = useRecoilState(goalState);
  const [showSettings, setShowSettings] = useState(false); // 설정 영역 보이기/감추기 상태

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
          setMinutes(initialMinutes); // 초기 분으로 리셋
          setSeconds(initialSeconds); // 초기 초로 리셋
        } else if (goal < MAX_GOAL) {
          setGoal((prevGoal) => prevGoal + 1);
          setRound(0);
          setMinutes(initialMinutes); // 초기 분으로 리셋
          setSeconds(initialSeconds); // 초기 초로 리셋
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

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setMinutes(initialMinutes); // 초기 분으로 리셋
    setSeconds(initialSeconds); // 초기 초로 리셋
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

  return (
    <TimerContainer>
      <TimerTitle>Pomodoro</TimerTitle>
      <TimerDisplay>
        <TimerDigit>{minutes}</TimerDigit>
        <TimerColon>:</TimerColon>
        <TimerDigit>{seconds < 10 ? `0${seconds}` : seconds}</TimerDigit>
      </TimerDisplay>
      <TimerForm onSubmit={handleSubmit(onSubmit)}>
        <SettingsContainer>
          <SettingsButton type="button" onClick={toggleSettings}>
            ⚙️
          </SettingsButton>
          {showSettings && (
            <>
              <TimerLabel>분: </TimerLabel>
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
              {errors.minutes && <p>{errors.minutes.message}</p>}
              <TimerLabel>초: </TimerLabel>
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
            </>
          )}
        </SettingsContainer>
      </TimerForm>
      <div>
        <TimerButton onClick={handleStartPause}>
          {isActive ? "일시정지" : "시작"}
        </TimerButton>
        <TimerButton onClick={handleReset}>리셋</TimerButton>
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

export default App2;
