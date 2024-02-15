import { useState, useMemo, useReducer, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Tower, TowersWrapper } from "./components";
import { buildDiskSizesForLvls } from "./disk-sizes";
import { FIRST_TOWER, THIRD_TOWER } from "./alghorithm";
import { useSolver } from "./useSolver";

const Select = styled.select`
  margin-left: 15px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  margin: 5px;

  button {
    background-color: #eee;
    padding: 8px 16px;
    outline: none;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  > button:not(:last-child) {
    margin-right: 10px;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  > &{Tower} {
    margin-right: 15px
  }

  > p {
    font-weight: bold;
    margin: 10px 0;

    > span {
      font-weight: normal
    }
  }
`;

const initialDisksCount = 3;
const initialGameState = {
  disks: [],
  towers: [[], [], []],
  userMoves: 0,
};

function buildDisksState(disksCount, disksScheme) {
  return Array.from({ length: disksCount }, (_, index) => ({
    id: index,
    ...disksScheme[index + 1],
  }));
}

function towersUpdater(towers, updaters) {
  return towers.map((disks, index) => {
    const forRestUpdater = updaters.rest !== undefined;

    if (updaters[index]) {
      return updaters[index](disks);
    }

    return forRestUpdater ? updaters.rest(disks) : [];
  });
}

function disksReducer(state, action) {
  switch (action.type) {
    case "BUILD_DISKS_STATE":
      return {
        ...initialGameState,
        disks: action.payload,
        towers: towersUpdater(state.towers, {
          [FIRST_TOWER]: () => action.payload,
        }),
      };
    case "MOVE_DISK":
      const { diskId, fromTower, toTower } = action.payload;
      const disk = state.towers[fromTower].find((disk) => disk.id === diskId);

      return {
        ...state,
        userMoves: state.userMoves + 1,
        towers: towersUpdater(state.towers, {
          [fromTower]: (disks) => disks.filter((disk) => disk.id !== diskId),
          [toTower]: (disks) => [disk, ...disks],
          rest: (disks) => disks,
        }),
      };
    case "RESTART":
      return {
        ...initialGameState,
        disks: state.disks,
        towers: towersUpdater(state.towers, {
          [FIRST_TOWER]: () => state.disks,
        }),
      };
    default:
      return state;
  }
}

function useCompleteState(disksCount, towers, cb) {
  const isComplete = disksCount === towers[THIRD_TOWER].length;

  useEffect(() => {
    if (isComplete) {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  return isComplete;
}

function useInitialState(disksCount, towers, cb) {
  const isInitial = disksCount === towers[FIRST_TOWER].length;

  useEffect(() => {
    if (isInitial) {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitial]);

  return isInitial;
}

const DISKS_VARRIANTS = [3, 4, 5, 6, 7, 8];

export function App() {
  const [disksCount, setDisksCount] = useState(initialDisksCount);
  const [gameState, dispatch] = useReducer(disksReducer, initialGameState);
  const disksScheme = useMemo(
    () => buildDiskSizesForLvls(disksCount),
    [disksCount]
  );

  const onMoveDisk = useCallback(({ diskId, fromTower, toTower }) => {
    dispatch({ type: "MOVE_DISK", payload: { fromTower, toTower, diskId } });
  }, []);

  const { inProgress, isPause, solve, clearIntervalId, pause, play, restart } =
    useSolver(gameState.towers, onMoveDisk);

  const onRestart = useCallback(() => {
    restart();
    dispatch({ type: "RESTART" });
  }, [restart]);

  const onCompleteCallback = useCallback(() => {
    setTimeout(() => {
      alert(`Completed in ${gameState.userMoves} moves`);
    }, 100);
  }, [gameState.userMoves]);

  const isInitial = useInitialState(
    disksCount,
    gameState.towers,
    clearIntervalId
  );

  useCompleteState(disksCount, gameState.towers, onCompleteCallback);

  useEffect(() => {
    dispatch({
      type: "BUILD_DISKS_STATE",
      payload: buildDisksState(disksCount, disksScheme),
    });
  }, [disksCount, disksScheme]);

  return (
    <Wrapper>
      <TowersWrapper>
        {Array.from({ length: 3 }, (_, index) => (
          <Tower
            key={index}
            id={index}
            disks={gameState.towers[index]}
            onMoveDisk={onMoveDisk}
          />
        ))}
      </TowersWrapper>
      <p>
        Your numbers of move: <span>{gameState.userMoves}</span>
      </p>
      <p>
        Number of disks
        <Select
          onChange={(event) => {
            restart();
            setDisksCount(Number.parseInt(event.target.value));
          }}
          value={disksCount}
        >
          {DISKS_VARRIANTS.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </Select>
      </p>
      <ButtonsWrapper>
        {!inProgress && (
          <button disabled={!isInitial} onClick={solve}>
            solve it!
          </button>
        )}
        {inProgress && !isPause && <button onClick={pause}>pause</button>}
        {inProgress && isPause && <button onClick={play}>play</button>}
        <button onClick={onRestart}>restart</button>
      </ButtonsWrapper>
    </Wrapper>
  );
}
