const getDateString = (): string => {
return new Date()
  .toDateString()
  .replaceAll(' ', '-');
}
export { getDateString };