import { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'

const LOCAL_STORAGE_COUNT = 'count';

/* Sets listeners for Value Buttons */
function useCountButtons(
  buttonsWrapperRef,
) {
  const [count, setCount] = useState(parseInt(localStorage.getItem(LOCAL_STORAGE_COUNT)) || 0);

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
  }, [
    buttonsWrapperRef,
    count,
  ]);

  return [count, setCount];
};

export default useCountButtons;