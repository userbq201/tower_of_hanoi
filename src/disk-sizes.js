import Color from "color";

const varriablesForLvl1 = { width: 50, color: generateColor() };
const CONSTANT_SIZE = 20;

function generateColor() {
  const getRange = () => Math.ceil(Math.random() * 255);

  return Color({ r: getRange(), g: getRange(), b: getRange() }).toString();
}

export function buildDiskSizesForLvls(maxLvl = 4) {
  return Array.from({ length: maxLvl }).reduce(
    (acc, _, index) => {
      if (index > 0) {
        return {
          ...acc,
          [index + 1]: {
            width: acc[index].width + CONSTANT_SIZE,
            color: generateColor(),
          },
        };
      }

      return acc;
    },
    { 1: varriablesForLvl1 }
  );
}
