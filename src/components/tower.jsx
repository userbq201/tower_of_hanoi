import styled from "styled-components";
import { useDrop } from "react-dnd";
import { Disk } from "./disk";

const TowerPlane = styled.div`
  display: block;
  width: 8px;
  height: 200px;
  position: absolute;
  background-color: #eee;
  border: 1px solid black;
  border-radius: 4px;
`;

const TowerBottomLine = styled.div`
  display: block;
  width: 200px;
  height: 8px;
  background-color: #eee;
  border: 1px solid black;
  border-radius: 4px;
  z-index: 2;
`;

const TowerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  position: relative;
  height: 204px;
`;

const Description = styled.p`
  position: absolute;
  transform: translateY(35px);
`;

export const TowersWrapper = styled.div`
  display: flex;
  margin: 15px 0;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 48px;
  }

  ${TowerContainer} {
    margin-right: 25px;
  }
`;

export function Tower({ children, id, disks = [], onMoveDisk }) {
  const [_, drop] = useDrop({
    accept: "disk",
    drop: () => ({ id }),
    canDrop: (item) => {
      if (disks.length > 0) {
        return disks[0].id > item.id;
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <TowerContainer ref={drop}>
      <TowerPlane />
      {disks.map((disk, index) => (
        <Disk
          key={disk.id}
          color={disk.color}
          width={disk.width}
          id={disk.id}
          onMove={onMoveDisk}
          canDrag={index === 0}
          towerId={id}
        />
      ))}
      <TowerBottomLine />
      {id === 2 && <Description>Target</Description>}
      {id === 0 && <Description>Source</Description>}
    </TowerContainer>
  );
}
