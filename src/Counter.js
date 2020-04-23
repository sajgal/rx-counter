import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { IoIosCog } from 'react-icons/io'
import { RiCloseLine } from 'react-icons/ri'

import useCountButtons from './hooks/useCountButtons';
import useDuration from './hooks/useDuration';
import useResetButton from './hooks/useResetButton';
import useStartStopButtons from './hooks/useStartStopButtons';
import sound from './choir.m4a';

const FUNCTION_START = 'start';
const FUNCTION_STOP = 'stop';
const FUNCTION_RESET = 'reset';
const SECONDS = 'seconds';
const MINUTES = 'minutes';
const AUDIO_DURATION_IN_SECONDS = 3;

const visuallyHidden = css`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px; width: 1px;
  margin: -1px; padding: 0; border: 0;
`;

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

const Controlls = styled.div`
  background: var(--color-black);
  padding-top: 30px;
  display: grid;
  grid-auto-flow: row;
  max-width: 100vw;
  grid-gap: 10px;

  @media (min-width: 420px) {
    grid-auto-flow: column;
  }
`;

const OptionsWrapper = styled.div`
  color: var(--color-white);
  width: 90%;
  display: grid;
  justify-self: center;
  margin-bottom: 90px;

  @media (min-width: 420px) {
    display: block;
    justify-self: right;
    width: 100%;
  }
`;

const Options = styled.div`
  ${({ visible }) => !visible && visuallyHidden};
  margin-top: 20px;
  border-left: 1px solid var(--color-white);
  padding-left: 5px;
`;

const ButtonsWrapper = styled.div`
  display: grid;
  grid-gap: 15px;
  justify-content: center;
  grid-template-columns: repeat(1, 90%);

  @media (min-width: 420px) {
    grid-template-rows: repeat(2, 60px) 50px;
    grid-template-columns: repeat(3, 85px);
    justify-content: right;
  }

  @media (min-width: 500px) {
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

  &:disabled {
    opacity: 0.5;
    cursor: default;

    &:hover {
      background: var(--color-white);
      color: var(--color-black);
    }
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

const OptionsButton = styled(Button)`
  display: flex;
  padding: 0 10px;
  height: 30px;
  font-size: 1.5em;
  justify-content: center;
`;

const Label = styled.label`
  display: block;
`;

const PlayEveryValueInput = styled.input`
  margin: 5px 5px 7px 0;
  width: 40px;
`;

const Counter = () => {
  const buttonsWrapperRef = useRef(null);
  const audioPlayer = useRef(null);
  const [isOptionBarVisible, setIsOptionBarVisible] = useState(false);
  const [playEveryValue, setPlayEveryValue] = useState(0);
  const [playEveryUnit, setPlayEveryUnit] = useState(SECONDS);

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
  const [count, setCount] = useCountButtons(buttonsWrapperRef);

  /* Sets listeners for Start & End buttons */
  const [start, end, setStart, setEnd] = useStartStopButtons(
    buttonsWrapperRef,
    FUNCTION_START,
    FUNCTION_STOP,
  );

  /* Sets duration */
  const [duration, defaultDuration, setDuration] = useDuration(end, start);

  /* Sets listeners for Reset button */
  useResetButton(
    buttonsWrapperRef,
    defaultDuration,
    FUNCTION_RESET,
    setCount,
    setDuration,
    setEnd,
    setStart,
  );

  const velocity = {
    perMinute: duration.seconds > 0
      ? ((count / duration.seconds) * 60).toFixed(2)
      : '-',
    perHour: duration.seconds > 0
      ? ((count / duration.seconds) * (60 * 60)).toFixed(2)
      : '-',
  }

  const onOptionsToggle = () => {
    setIsOptionBarVisible(!isOptionBarVisible);
  }

  const onPlayEveryValueChange = (event) => {
    setPlayEveryValue(event.target.value);
  }

  const onPlayEveryUnitChange = (event) => {
    setPlayEveryUnit(event.target.value);
  }

  const getPlayEveryXSeconds = () => {
    return playEveryUnit === SECONDS ? playEveryValue : playEveryValue * 60;
  };

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
      <Controlls>
        <ButtonsWrapper ref={buttonsWrapperRef}>
          {!!buttons && buttons.map((button) => <Button
            ref={button.ref}
            key={button.label}
            data-value={button.value}
            data-function={button.function}
            disabled={
              (button.function === FUNCTION_RESET && !end && !start && !count)
              || (button.function === FUNCTION_START && start)
              || (button.function === FUNCTION_STOP && end)
              || (button.function === FUNCTION_STOP && !end && !start)
            }
          >
            {button.label}
          </Button>)}
        </ButtonsWrapper>
        <OptionsWrapper>
          <OptionsButton onClick={onOptionsToggle}>
            {isOptionBarVisible ? <RiCloseLine /> : <IoIosCog />}
          </OptionsButton>
          <Options visible={isOptionBarVisible}>
            <Label htmlFor="playEveryValue">Play sound every</Label>
            <PlayEveryValueInput type="text" id="playEveryValue" onChange={onPlayEveryValueChange} value={playEveryValue} />
            <select name="time-unit" id="time-unit" onChange={onPlayEveryUnitChange} value={playEveryUnit}>
              <option value={SECONDS}>second{playEveryValue > 1 ? 's' : ''}</option>
              <option value={MINUTES}>minute{playEveryValue > 1 ? 's' : ''}</option>
            </select>

            {
              (
                start //don't play if counter not running
                && !end //don't play if workout ended
                && duration.seconds > AUDIO_DURATION_IN_SECONDS //don't play at the beginning
                && duration.seconds % getPlayEveryXSeconds() <= AUDIO_DURATION_IN_SECONDS //keep <audio> in the DOM while playing
              )
              && <audio ref={audioPlayer} src={sound} autoPlay />
            }
          </Options>
        </OptionsWrapper>
      </Controlls>
    </Wrapper>
  );
};

export default Counter;