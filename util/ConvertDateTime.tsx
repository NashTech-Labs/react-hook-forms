import moment from "moment";

export function convertDateTime(date: object | null, time: object | null) {
  let utcTimestamp =
    `${moment(date).format("YYYY-MM-DD")}` +
    "T" +
    `${moment(time).format("HH:mm:ss")}`;

  return utcTimestamp;
}
