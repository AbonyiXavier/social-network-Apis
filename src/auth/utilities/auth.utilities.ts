import { differenceInYears } from 'date-fns';

/**
 * Validate date of birth to make sure users are at least 18 year before signup
 */
export const validateDateOfBirth = (dateOfBirth: Date): void => {
  const currentDate = new Date();
  const dob = new Date(dateOfBirth);
  const age = differenceInYears(currentDate, dob);

  if (age < 18) {
    throw new Error('You must be at least 18 years old to sign up.');
  }
};
