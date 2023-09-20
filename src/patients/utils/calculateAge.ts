export const calculateAge = (dob: string) => {

  // Calculate the difference in milliseconds
  const ageInMilliseconds = Date.parse(new Date().toString()) - Date.parse(dob);

  // Calculate the number of milliseconds in a year (assuming an average year of 365.25 days)
  const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;

  // Calculate the age in years by dividing the difference by milliseconds in a year
  const ageInYears = ageInMilliseconds / millisecondsInYear;

  // Round down to the nearest whole year
  const roundedAge = Math.floor(ageInYears);

  return roundedAge;
}