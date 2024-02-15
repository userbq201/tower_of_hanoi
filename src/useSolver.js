import { useState, useEffect, useCallback, useRef } from "react";
import { alghorithmRunner } from "./alghorithm";

export function useSolver(towers, moveDisk) {
  const [steps, setSteps] = useState([]);
  const [isPause, setPause] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const intervalId = useRef();
  const step = useRef(0);

  const clearIntervalId = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);

      intervalId.current = undefined;
    }
  }, []);

  const pause = useCallback(() => {
    setPause(true);
    clearIntervalId();
  }, [clearIntervalId]);

  const play = useCallback(() => {
    setPause(false);
    intervalId.current = setInterval(() => {
      if (step.current < steps.length) {
        moveDisk(steps[step.current]);
        step.current += 1;

        return;
      }

      clearIntervalId();
      setInProgress(false);
    }, 1000);
  }, [clearIntervalId, moveDisk, steps]);

  const solve = useCallback(() => {
    const rs = alghorithmRunner(towers);

    setSteps(rs);
    setInProgress(true);
  }, [towers]);

  const restart = useCallback(() => {
    clearIntervalId();
    setInProgress(false);
    step.current = 0;
    setSteps([]);
  }, [clearIntervalId]);

  useEffect(() => {
    if (steps.length > 0) {
      play();
    }
  }, [play, steps.length]);

  return {
    inProgress,
    isPause,
    pause,
    play,
    clearIntervalId,
    solve,
    restart,
  };
}
