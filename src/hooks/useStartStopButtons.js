import { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import moment from 'moment';

const LOCAL_STORAGE_START = 'start';
const LOCAL_STORAGE_END = 'end';

/* Sets listeners for Start & End buttons */
const useStartStopButtons = (
  buttonsWrapperRef,
  functionStartLabel,
  functionStopLabel,
) => {
  const [start, setStart] = useState(
    localStorage.getItem(LOCAL_STORAGE_START)
      ? moment(localStorage.getItem(LOCAL_STORAGE_START))
      : undefined
  );
  const [end, setEnd] = useState(
    localStorage.getItem(LOCAL_STORAGE_END)
      ? moment(localStorage.getItem(LOCAL_STORAGE_END))
      : undefined
  );

  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.function),
        map((event) => event.srcElement.dataset.function),
      );

    const start$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === functionStartLabel),
      map(() => moment()),
      tap((start) => setStart(start)),
      tap((start) => localStorage.setItem(LOCAL_STORAGE_START, start.format())),
    ).subscribe();

    const stop$ = click$.pipe(
      filter((buttonFunction) => buttonFunction === functionStopLabel),
      map(() => moment()),
      tap((end) => setEnd(end)),
      tap((end) => localStorage.setItem(LOCAL_STORAGE_END, end.format())),
    ).subscribe();

    return () => {
      start$.unsubscribe();
      stop$.unsubscribe();
    }
  }, [
    buttonsWrapperRef,
    functionStartLabel,
    functionStopLabel,
  ]);

  return [start, end, setStart, setEnd];
};

export default useStartStopButtons;