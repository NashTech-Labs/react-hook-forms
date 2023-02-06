import moment from "moment";

export function convertToUTC(date: object | null, time: object | null) {
    let utcTimestamp = moment
      .utc(
        moment(
          `${moment(date).format("YYYY-MM-DD")}` +
            " " +
            `${moment(time).format("HH:mm:ss")}`
        ).format()
      )
      .valueOf();

    return utcTimestamp;
  };