export const formatDate = (tmdbDate) => {
  const newDate = new Date(tmdbDate);
  const date =
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const month =
    newDate.getMonth() + 1 < 10
      ? `0${newDate.getMonth() + 1}`
      : newDate.getMonth() + 1;
  return `${date}/${month}/${newDate.getFullYear()}`;
};

export const getYear = (tmdbDate) => {
  const newDate = new Date(tmdbDate);
  return newDate.getFullYear();
};
