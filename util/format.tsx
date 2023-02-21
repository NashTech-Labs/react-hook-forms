export function dateFormat(date: string) {
  return (
    new Date(date).toDateString().slice(4, 10) +
    "," +
    new Date(date).toDateString().slice(10, 16)
  );
}

export function dateTimeFormat(date: string) {
  return (
    new Date(date).toDateString().slice(4, 10) +
    "," +
    new Date(date).toDateString().slice(10, 16) +
    " at " +
    new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }) +
    " EST "
  );
}

export function dateTimeFormatPreview(date: string) {
  return (
    new Date(date).toDateString().slice(4, 10) + " (" +
    new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }) + " EST) "
  );
}

export function capitalizeWords(string: string) {
  return (string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase())
}


