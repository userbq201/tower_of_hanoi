import { useDrag } from "react-dnd";
import styled from "styled-components";

export const DiskUI = styled.div`
  height: 21px;
  width: ${(props) => props.diskWidth}px;
  background-color: ${(props) => props.diskColor};
  z-index: 2;
  opacity: ${(props) => (props.isDragging ? 0 : 1)};
  border-radius: 4px;
`;

export function Disk({ id, color, width, onMove, canDrag, towerId }) {
  const [{ isDragging }, drag] = useDrag({
    type: "disk",
    item: () => ({ id }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (item && dropResult) {
        onMove({ diskId: item.id, toTower: dropResult.id, fromTower: towerId });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => canDrag,
  });

  return (
    <DiskUI
      ref={drag}
      diskColor={color}
      diskWidth={width}
      isDragging={isDragging}
    />
  );
}
