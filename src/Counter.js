import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import styled from 'styled-components';

const LOCAL_STORAGE_COUNT = 'count';

const Wrapper = styled.div`
  display: grid;
  min-height: 100vh;

  & * {
    font-family: 'Open Sans Condensed', sans-serif;
  }
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ count }) => {
    if (count < 1) {
      return 'var(--color-red)';
    }

    if (count > 99) {
      return 'var(--color-green)';
    }
  }};
  font-size: 3em;
  font-weight: 700;
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
      grid-column: 2 / 3;

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
  const buttonsWrapperRef = useRef();

  const buttons = [
    { label: '+10', value: 10 },
    { label: '+5', value: 5 },
    { label: '+1', value: 1 },
    { label: '-10', value: -10 },
    { label: '-5', value: -5 },
    { label: '-1', value: -1 },
    { label: 'reset', value: 0 },
  ];

  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.value),
        map(event => parseInt(event.srcElement.dataset.value)),
        map((value) => value === 0 ? 0 : count + value),
        tap(setCount),
        tap(newCountValue => localStorage.setItem(LOCAL_STORAGE_COUNT, newCountValue)),
      )
      .subscribe();

    return () => click$.unsubscribe();
  }, [count, buttonsWrapperRef]);

  return (
    <Wrapper>
      <Count count={count}>{count}</Count>
      <ButtonsWrapper ref={buttonsWrapperRef}>
        {buttons.map((button) => <Button
          ref={button.ref}
          key={button.label}
          data-value={button.value}
        >
          {button.label}
        </Button>)}
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default Counter;