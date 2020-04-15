import { useEffect, useState } from 'react';
import { interval } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import moment from 'moment';

const LOCAL_STORAGE_DURATION = 'duration';
const DEFAULT_DURATION = { string: '00:00:00', seconds: 0 };

/* Sets duration every second */
const useCountButtons = (
  endTime,
  startTime,
) => {
  const timer$ = interval(1000);
  const [duration, setDuration] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_DURATION))
    || DEFAULT_DURATION
  );

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
        LOCAL_STORAGE_DURATION,
        JSON.stringify(duration)
      )),
    ).subscribe();

    return () => timerSubscription.unsubscribe();
  }, [
    endTime,
    startTime,
    timer$,
  ]);

  return [duration, DEFAULT_DURATION, setDuration];
};

export default useCountButtons;