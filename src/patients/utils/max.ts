export const max = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  let max = Number(numbers[0]);

  numbers.forEach((num) => {
    if (Number(num) > (max)) max = Number(num);
  });
 return max;
};
