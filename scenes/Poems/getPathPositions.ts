interface RoomPosition {
  x: number;
  z: number;
}

function getRoomPosition(
  verticalSpace: number
): (seedItem: string, index: number, seedItemsList: string[]) => RoomPosition {
  return function (
    seedItem: string,
    index: number,
    seedItemsList: string[]
  ): RoomPosition {
    const highest = [...seedItemsList].sort(
      (a: string, b: string) => Number(b) - Number(a)
    )[0];
    const roomPosition = {
      x: Math.round(
        (Number(seedItem) / Number(highest) - 0.5) * Number(highest)
      ),
      z:
        Math.round(
          ((index + 0.5) / seedItemsList.length - 0.5) * seedItemsList.length
        ) * verticalSpace,
    };

    return roomPosition;
  };
}

function getRooms(seed: number, verticalSpace: number): RoomPosition[] {
  return String(seed).split("").map(getRoomPosition(verticalSpace));
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000000000000);
}

function getRoomsWithWalkPaths(rooms: RoomPosition[]): RoomPosition[] {
  const newRooms: RoomPosition[] = [];
  for (const [index, room] of Object.entries(rooms)) {
    let lastRoom = room;
    const nextRoom = rooms[Number(index) + 1];

    newRooms.push(room);

    while (
      JSON.stringify(lastRoom) !== JSON.stringify(nextRoom) &&
      Number(index) < rooms.length - 1
    ) {
      const direction = Math.sign(nextRoom.x - lastRoom.x) as -1 | 1 | 0;

      if (direction) {
        lastRoom = {
          x: lastRoom.x + direction,
          z: lastRoom.z,
        };

        newRooms.push(lastRoom);

        continue;
      }

      lastRoom = {
        x: lastRoom.x,
        z: lastRoom.z + 1,
      };

      newRooms.push(lastRoom);

      break;
    }
  }

  return newRooms;
}

function getPathPositions(
  seed = getRandomSeed(),
  verticalSpace = 2
): RoomPosition[] {
  console.log(seed);

  const roomsPaths = getRooms(seed, verticalSpace);
  const roomsWithWalkPaths = getRoomsWithWalkPaths(roomsPaths);

  return roomsWithWalkPaths;
}

export default getPathPositions;
