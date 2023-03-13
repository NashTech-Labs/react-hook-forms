import moment from "moment";
import { convertDateTime, convertToEST, dateTimePreviewGenerator } from "./ConvertDateTime";


describe("Convert Date Time", () => {
  test("Convert Date time ISO String", () => {
    const date = moment("2023-03-05");
    const time = moment("2023-03-05");
    const result = convertDateTime(date,time);
    expect(result).toBe("2023-03-05T05:00:00.000Z");
  });

  test("date time preview generator", () => {
    const date = moment("2023-03-05");
    const time = moment("2023-03-05");
    const result = dateTimePreviewGenerator(date,time,date,time);
    expect(result).toBe("Mar 5, 2023 from 12:00 AM EST to Mar 5, 2023 at 12:00 AM EST");
  });

  test("convert to EST", () => {
    const date = "2023-03-06T18:01:00"
    const result = convertToEST(date);
    expect(JSON.stringify(result)).toBe(JSON.stringify("2023-03-06T18:01:00.000Z"));
  });
});