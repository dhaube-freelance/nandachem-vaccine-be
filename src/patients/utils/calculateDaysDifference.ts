export const calculateDaysDifference = (initial: string) => {

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Date.parse(new Date().toString()) - Date.parse(initial);

  // Calculate the number of milliseconds in a year (assuming an average year of 365.25 days)
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  // Calculate the age in years by dividing the difference by milliseconds in a year
  const days = diffInMilliseconds / millisecondsInADay;

  // Round down to the nearest whole year
  const roundedDays = Math.floor(days);

  return roundedDays;
}