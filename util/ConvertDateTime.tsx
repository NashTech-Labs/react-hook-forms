import moment from "moment";

export function convertDateTime(date: object | null, time: object | null) {
  let utcTimestamp =
    `${moment(date).format("YYYY-MM-DD")}` +
    "T" +
    `${moment(time).format("HH:mm:ss")}`;

  return utcTimestamp;
}

export function dateTimePreviewGenerator(startDate: object | null, startTime: object | null, endDate: object | null, endTime: object | null){
  let customerPreview = `${moment(startDate).format("ll")} from ${moment(
    startTime
  ).format("LT")} EST to ${moment(endDate).format("ll")} at ${moment(
    endTime
  ).format("LT")} EST`

  return customerPreview
}
