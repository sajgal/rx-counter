import React, { useRef, useEffect } from 'react';
import { fromEvent, interval } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';

const LOCAL_STORAGE_COUNT = 'count';
const LOCAL_STORAGE_START = 'start';
const LOCAL_STORAGE_END = 'end';
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
  display: grid;
  grid-gap: 5px;
  grid-template:
    'count duration'
    'count velocity';
`;

const Count = styled.div`
  grid-area: count;
  justify-self: right;
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
`;

const Duration = styled.div`
  grid-area: duration;
  align-self: flex-end;
  font-size: 1.3em;
`;

const Velocity = styled.div`
  grid-area: velocity;
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
  grid-template-rows: repeat(2, 70px) 50px;
  grid-template-columns: repeat(3, 110px);
  grid-gap: 30px;
  justify-content: center;
  background: var(--color-black);
  padding-top: 30px;
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
  const [startTime, setStartTime] = useState(localStorage.getItem(LOCAL_STORAGE_START) || undefined);
  const [endTime, setEndTime] = useState(localStorage.getItem(LOCAL_STORAGE_END) || undefined);
  const buttonsWrapperRef = useRef();
  const timer$ = interval(1000);
  const [duration, setDuration] = useState(DEFAULT_DURATION);

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
  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.value),
        map(event => parseInt(event.srcElement.dataset.value)),
        map((value) => count + value),
        tap(setCount),
        tap(newCountValue => localStorage.setItem(LOCAL_STORAGE_COUNT, newCountValue)),
      )
      .subscribe();

    return () => click$.unsubscribe();
  }, [count, buttonsWrapperRef]);

  /* Sets listeners for Start & End button */
  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.function),
        map((event) => event.srcElement.dataset.function),
      );

    const start$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === FUNCTION_START),
      map(() => moment()),
      tap((start) => setStartTime(start)),
      tap((start) => localStorage.setItem(LOCAL_STORAGE_START, start)),
    ).subscribe();

    const stop$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === FUNCTION_STOP),
      map(() => moment()),
      tap((end) => setEndTime(end)),
      tap((end) => localStorage.setItem(LOCAL_STORAGE_END, end)),
    ).subscribe();

    const reset$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === FUNCTION_RESET),
      tap(() => {
        setStartTime(undefined);
        setEndTime(undefined);
        setCount(0);
        setDuration(DEFAULT_DURATION);
        localStorage.clear();
      }),
    ).subscribe();

    return () => {
      start$.unsubscribe();
      stop$.unsubscribe();
      reset$.unsubscribe();
    }
  }, [startTime, endTime, buttonsWrapperRef]);

  /* Sets duration every second */
  useEffect(() => {
    const timerSubscription = timer$.pipe(
      filter(() => startTime !== undefined && endTime === undefined),
      tap(() => console.log(startTime)),
      map(() => moment.duration(moment().diff(startTime))),
      map((duration) => {
        const inSeconds = duration.asSeconds();

        const hours = duration.hours();
        duration.subtract(moment.duration(hours, 'hours'));

        const minutes = duration.minutes();
        duration.subtract(moment.duration(minutes, 'minutes'));

        const seconds = duration.seconds();
        const pad = (number) => number < 10 ? `0${number}` : number;

        return {
          seconds: parseInt(inSeconds),
          string: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
        }
      }),
      tap(setDuration),
    ).subscribe();

    return () => timerSubscription.unsubscribe();
  }, [startTime, endTime, duration, timer$]);

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
        {buttons.map((button) => <Button
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