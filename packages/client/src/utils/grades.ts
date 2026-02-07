export const grades = [
  "K",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

export const numberToGrade = (grade: number): string => {
  if (grade < 0 || grade > 12) throw new Error("Grade is not a valid number");
  return grades[grade];
};
