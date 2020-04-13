import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'

/* Sets listeners for Value Buttons */
function useCountButtons(
  buttonsWrapperRef,
  count,
  localStorageCountLabel,
  setCount,
) {
  useEffect(() => {
    const click$ = fromEvent(buttonsWrapperRef.current, 'click')
      .pipe(
        filter((event) => event.srcElement.dataset.value),
        map(event => parseInt(event.srcElement.dataset.value)),
        map((value) => count + value),
        tap(setCount),
        tap(newCountValue => localStorage.setItem(localStorageCountLabel, newCountValue)),
      )
      .subscribe();

    return () => click$.unsubscribe();
  }, [
    buttonsWrapperRef,
    count,
    localStorageCountLabel,
    setCount,
  ]);
};

export default useCountButtons;