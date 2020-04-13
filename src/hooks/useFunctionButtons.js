import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import moment from 'moment';

/* Sets listeners for Start, End & Reset button */
const useFunctionButtons = (
  buttonsWrapperRef,
  defaultDuration,
  endTime,
  functionResetLabel,
  functionStartLabel,
  functionStopLabel,
  localStorageEndLabel,
  localStorageStartLabel,
  setCount,
  setDuration,
  setEndTime,
  setStartTime,
  startTime,
) => {
  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.function),
        map((event) => event.srcElement.dataset.function),
      );

    const start$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === functionStartLabel),
      map(() => moment()),
      tap((start) => setStartTime(start)),
      tap((start) => localStorage.setItem(localStorageStartLabel, start.format())),
    ).subscribe();

    const stop$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === functionStopLabel),
      map(() => moment()),
      tap((end) => setEndTime(end)),
      tap((end) => localStorage.setItem(localStorageEndLabel, end.format())),
    ).subscribe();

    const reset$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === functionResetLabel),
      tap(() => {
        setStartTime(undefined);
        setEndTime(undefined);
        setCount(0);
        setDuration(defaultDuration);
        localStorage.clear();
      }),
    ).subscribe();

    return () => {
      start$.unsubscribe();
      stop$.unsubscribe();
      reset$.unsubscribe();
    }
  }, [
    buttonsWrapperRef,
    defaultDuration,
    endTime,
    functionResetLabel,
    functionStartLabel,
    functionStopLabel,
    localStorageEndLabel,
    localStorageStartLabel,
    setCount,
    setDuration,
    setEndTime,
    setStartTime,
    startTime,
  ]);
};

export default useFunctionButtons;