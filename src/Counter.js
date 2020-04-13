import React, { useRef } from 'react';
import { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import useCountButtons from './hooks/useCountButtons';
import useFunctionButtons from './hooks/useFunctionButtons';
import useDuration from './hooks/useDuration';

const LOCAL_STORAGE_COUNT = 'count';
const LOCAL_STORAGE_START = 'start';
const LOCAL_STORAGE_END = 'end';
const LOCAL_STORAGE_DURATION = 'duration';
const FUNCTION_START = 'start';
const FUNCTION_STOP = 'stop';
const FUNCTION_RESET = 'reset';
const DEFAULT_DURATION = { string: '00:00:00', seconds: 0 };

const Wrapper = styled.div`
  display: grid;
  min-height: 100vh;

  & * {
    font-family: 'Open Sans Condensed', sans-serif;
  }
`;

const Display = styled.div`
  text-align: center;
  display: grid;
  grid-gap: 5px;
  grid-template:
    'count'
    'duration'
    'velocity';

  @media (min-width: 320px) {
    grid-template:
      'count duration'
      'count velocity';
    text-align: left;
  }
`;

const Count = styled.div`
  grid-area: count;
  justify-self: center;
  align-self: center;
  color: ${({ count }) => {
    if (count < 1) {
      return 'var(--color-red)';
    }

    if (count > 99) {
      return 'var(--color-green)';
    }
  }};
  font-size: 5em;
  font-weight: 700;
  padding-right: 10px;

  @media (min-width: 320px) {
    justify-self: right;
  }
`;

const Duration = styled.div`
  grid-area: duration;
  align-self: flex-end;
  justify-self: center;
  font-size: 1.3em;

  @media (min-width: 320px) {
    justify-self: left;
  }
`;

const Velocity = styled.div`
  grid-area: velocity;
  justify-self: center;

  @media (min-width: 320px) {
    justify-self: left;
  }
`;

const Bold = styled.span`
  font-weight: bold;
`;

const Time = styled.span`
  color: var(--color-red);
  font-weight: bold;
`;

const ButtonsWrapper = styled.div`
  display: grid;
  grid-gap: 15px;
  justify-content: center;
  background: var(--color-black);
  padding-top: 30px;
  grid-template-columns: repeat(1, 90%);

  @media (min-width: 320px) {
    grid-template-rows: repeat(2, 60px) 50px;
    grid-template-columns: repeat(3, 85px);
  }

  @media (min-width: 425px) {
    grid-gap: 30px;
    grid-template-rows: repeat(2, 70px) 50px;
    grid-template-columns: repeat(3, 110px);
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 3px;
  box-shadow: 0px 0px 2px var(--color-green);
  background: var(--color-white);
  cursor: pointer;
  font-size: 1.5em;

  &:hover {
    background: var(--color-green);
    color: var(--color-white);
  }

  &:last-child {
      background: var(--color-black);
      border: 2px solid var(--color-red);
      color: var(--color-red);

      &:hover {
        background: var(--color-red);
        color: var(--color-black);
      }
  }
`;

const Counter = () => {
  const [count, setCount] = useState(parseInt(localStorage.getItem(LOCAL_STORAGE_COUNT)) || 0);
  const [startTime, setStartTime] = useState(
    localStorage.getItem(LOCAL_STORAGE_START)
      ? moment(localStorage.getItem(LOCAL_STORAGE_START))
      : undefined
  );
  const [endTime, setEndTime] = useState(
    localStorage.getItem(LOCAL_STORAGE_END)
      ? moment(localStorage.getItem(LOCAL_STORAGE_END))
      : undefined
  );
  const buttonsWrapperRef = useRef();
  const [duration, setDuration] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_DURATION))
    || DEFAULT_DURATION
  );

  const buttons = [
    { label: '+10', value: 10 },
    { label: '+5', value: 5 },
    { label: '+1', value: 1 },
    { label: '-10', value: -10 },
    { label: '-5', value: -5 },
    { label: '-1', value: -1 },
    { label: 'start', function: FUNCTION_START },
    { label: 'stop', function: FUNCTION_STOP },
    { label: 'reset', function: FUNCTION_RESET },
  ];

  /* Sets listeners for Value Buttons */
  useCountButtons(
    buttonsWrapperRef,
    count,
    LOCAL_STORAGE_COUNT,
    setCount,
  );

  /* Sets listeners for Start, End & Reset button */
  useFunctionButtons(
    buttonsWrapperRef,
    DEFAULT_DURATION,
    endTime,
    FUNCTION_RESET,
    FUNCTION_START,
    FUNCTION_STOP,
    LOCAL_STORAGE_END,
    LOCAL_STORAGE_START,
    setCount,
    setDuration,
    setEndTime,
    setStartTime,
    startTime,
  );

  /* Sets duration every second */
  useDuration(
    duration,
    endTime,
    LOCAL_STORAGE_DURATION,
    setDuration,
    startTime,
  );

  const velocity = {
    perMinute: duration.seconds > 0
      ? ((count / duration.seconds) * 60).toFixed(2)
      : '-',
    perHour: duration.seconds > 0
      ? ((count / duration.seconds) * (60 * 60)).toFixed(2)
      : '-',
  }

  return (
    <Wrapper>
      <Display>
        <Count count={count}>{count}</Count>
        <Duration>Elapsed time <Time>{duration.string}</Time></Duration>
        <Velocity>
          <div><Bold>{velocity.perMinute}</Bold> reps per minute</div>
          <div><Bold>{velocity.perHour}</Bold> reps per hour</div>
        </Velocity>
      </Display>
      <ButtonsWrapper ref={buttonsWrapperRef}>
        {!!buttons && buttons.map((button) => <Button
          ref={button.ref}
          key={button.label}
          data-value={button.value}
          data-function={button.function}
        >
          {button.label}
        </Button>)}
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default Counter;