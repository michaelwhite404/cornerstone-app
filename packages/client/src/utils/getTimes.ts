const getTimes = (time: string) => {
  const arr = time.split(" ");
  const timeSplit = [...arr[0].split(":"), arr[1]];
  if (timeSplit[2] === "PM" && Number(timeSplit[0]) < 12) {
    return { hours: +timeSplit[0] + 12, minutes: +timeSplit[1] };
  }
  if (timeSplit[2] === "AM" && Number(timeSplit[0]) === 12) {
    return { hours: 0, minutes: +timeSplit[1] };
  }
  return { hours: +timeSplit[0], minutes: +timeSplit[1] };
};

export default getTimes;
