import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'

/* Sets listeners for Reset button */
const useFunctionButtons = (
  buttonsWrapperRef,
  defaultDuration,
  functionResetLabel,
  setCount,
  setDuration,
  setEndTime,
  setStartTime,
) => {
  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.function),
        map((event) => event.srcElement.dataset.function),
      );

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
      reset$.unsubscribe();
    }
  }, [
    buttonsWrapperRef,
    defaultDuration,
    functionResetLabel,
    setCount,
    setDuration,
    setEndTime,
    setStartTime,
  ]);
};

export default useFunctionButtons;