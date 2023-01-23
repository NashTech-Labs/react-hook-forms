import { isValidEmail } from "./Validation";

describe("Validation", () => {
  test("Test valid email", () => {
    const result = isValidEmail("akshit@gmail.com");
    expect(result).toBe(true);
  });
});