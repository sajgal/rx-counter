import { useEffect } from 'react';
import { interval } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import moment from 'moment';

/* Sets duration every second */
const useCountButtons = (
  duration,
  endTime,
  localStorageDuration,
  setDuration,
  startTime,
) => {
  const timer$ = interval(1000);

  useEffect(() => {
    const timerSubscription = timer$.pipe(
      filter(() => startTime !== undefined && endTime === undefined),
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
      tap((duration) => localStorage.setItem(
        localStorageDuration,
        JSON.stringify(duration)
      )),
    ).subscribe();

    return () => timerSubscription.unsubscribe();
  }, [
    duration,
    endTime,
    localStorageDuration,
    setDuration,
    startTime,
    timer$,
  ]);
};

export default useCountButtons;