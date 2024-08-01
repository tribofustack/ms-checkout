import { sanitizeOutput, verifyFilePaths, verifyUuid } from "./validator";

describe("validator", () => {
  describe("verifyUuid", () => {
    test("should be uuid", () => {
      const uuid = "a7a67b8e-5f28-4a3e-8a24-3f946918c2b6";
      try {
        verifyUuid(uuid);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    test("should not be uuid", () => {
      const uuidFalse = "abc-efd";
      try {
        verifyUuid(uuidFalse);
      } catch (err) {
        expect(err).toBeTruthy();
        expect(err.message).toBe("UUID is invalid!");
      }
    });
  });
  describe("verifyFilePaths", () => {
    test("should not be filepath", () => {
      const filepathFalse = "Testing file path";
      try {
        verifyFilePaths(filepathFalse);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
    test("should be filepath", () => {
      const filePathTrue = "/abc/efd";
      try {
        verifyFilePaths(filePathTrue);
      } catch (err) {
        expect(err).toBeTruthy();
        expect(err.message).toBe("Input is file path!");
      }
    });
  });
  describe("sanitizeOutput", () => {
    test("should escape dirty values", () => {
      const input = "Testing< sanitize &output>";
      const output = sanitizeOutput(input);
      expect(output).toBeTruthy();
      expect(output).toEqual("Testing&lt; sanitize &amp;output&gt;");
    });
  });
});
