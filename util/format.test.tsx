import { capitalizeWords, dateFormat } from "./format";


describe("format", () => {
  test("capitalize word", () => {
    const result = capitalizeWords("SUCCESS")
    expect(result).toBe("Success");
  });

  test("dateFormat", () => {
    const result = dateFormat("2023-03-09T05:00:00")
    expect(result).toBe("Mar 09, 2023");
  });
});