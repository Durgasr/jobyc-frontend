export const formatSalary = (salary) => {
  if (!salary) return "Not specified";

  // Convert to LPA (Lakhs per annum)
  const inLakhs = salary / 100000;

  if (inLakhs >= 1) {
    return `${inLakhs} LPA`;
  }

  // Fallback - return as monthly if less than 1 LPA
  return `${Math.round(salary / 1000)}k per year`;
};
