export function formatTerm(term, year) {
  if (!term) return "";
  const label = term.replace(" Only", "");
  return year ? `${label} ${year}` : label;
}