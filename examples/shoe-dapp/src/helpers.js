export const randomNumber = (num, variance) =>
  Math.floor(num + variance * num - Math.random() * variance * num * 2);
