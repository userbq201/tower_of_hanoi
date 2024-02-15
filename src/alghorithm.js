export const FIRST_TOWER = 0;
export const SECOND_TOWER = 1;
export const THIRD_TOWER = 2;

export function alghorithmRunner(disksState) {
  const steps = [];
  const disks = [
    disksState[FIRST_TOWER].slice(0), // FIRST_TOWER
    disksState[SECOND_TOWER].slice(0), // SECOND_TOWER
    disksState[THIRD_TOWER].slice(0), // THIRD_TOWER
  ];

  function getHelpTower(fromTower, toTower) {
    const arr1 = [FIRST_TOWER, SECOND_TOWER, THIRD_TOWER];
    const arr2 = [fromTower, toTower];
    const difference = arr1.filter((x) => !arr2.includes(x));

    return difference[0];
  }

  function hanoi(nDisks, fromTower, toTower) {
    if (nDisks > 1) {
      const HELP_TOWER = getHelpTower(fromTower, toTower);

      hanoi(nDisks - 1, fromTower, HELP_TOWER);
      moveDisk(fromTower, toTower);
      hanoi(nDisks - 1, HELP_TOWER, toTower);

      return;
    }

    moveDisk(fromTower, toTower);
  }

  function moveDisk(fromTower, toTower) {
    const disk = disks[fromTower].shift();

    disks[toTower].unshift(disk);

    steps.push({ fromTower, toTower, diskId: disk.id });
  }

  hanoi(disks[FIRST_TOWER].length, FIRST_TOWER, THIRD_TOWER);

  return steps;
}
