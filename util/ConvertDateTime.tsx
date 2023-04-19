import moment from "moment-timezone";

export function convertDateTime(date: object | null, time: object | null) {
  if(!date || !time) return null
  const timestamp =
    `${moment(date).format("YYYY-MM-DD")} ${moment(time).format("HH:mm")}`;
    const estTime = moment.tz(timestamp,"America/New_York").format();
  const utc = (new Date(estTime)).toUTCString()
  return (new Date(utc)).toISOString()
}

export function dateTimePreviewGenerator(startDate: object | null, startTime: object | null, endDate: object | null, endTime: object | null){
  if(!startDate || !startTime || !endDate || !endTime) return null
  let customerPreview = `${moment(startDate).format("ll")} from ${moment(
    startTime
  ).format("LT")} EST to ${moment(endDate).format("ll")} at ${moment(
    endTime
  ).format("LT")} EST`

  return customerPreview
}

export function convertToEST(date: string) {
  const estTime = moment.utc(date).tz("America/New_York");

  return estTime;
}
