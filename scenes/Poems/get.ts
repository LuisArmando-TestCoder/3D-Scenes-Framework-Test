interface RoomPosition {
  seedItem: string;
  x: number;
  z: number;
};

function getRoomPosition(
  seedItem: string,
  index: number,
  seedItemsList: string[]
): RoomPosition {
  const highest = [...seedItemsList].sort(
    (a: string, b: string) => Number(b) - Number(a)
  )[0];

  return {
    seedItem,
    x:
      (Number(String(seedItem)[index]) / Number(highest) - 0.5) *
      Number(highest),
    z: ((index + 0.5) / seedItemsList.length - 0.5) * seedItemsList.length,
  };
}

function getRooms(seed: number): RoomPosition[] {
  return String(seed).split("").map(getRoomPosition);
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000000000000);
}

function populateRoomsWithPaths(
  isHorizontalStart: boolean,
  rooms: RoomPosition[]
): RoomPosition[] {
  const newRooms = [];
  let isHorizontal = isHorizontalStart;
  let horizontalDirection = 0;

  for (const room of rooms) {
    
  }

  return rooms;
}

function getPathPositions(seed: number = getRandomSeed()): RoomPosition[] {
  const roomsPaths = getRooms(seed);

  return roomsPaths;
}

export default getPathPositions;
