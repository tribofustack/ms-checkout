import validator from "validator";

const verifyUuid = (input: string): void => {
  const isUuid = validator.isUUID(input);
  if (!isUuid) throw new Error("UUID is invalid!");
};

const verifyFilePaths = (input: string): void => {
  const patterns = [
    /\.\.[\/\\]/, // Detecta ../ ou ..\
    /[a-zA-Z]:(\\|\/|\\\\)/, // Detecta C:\, C:/ ou C:\\
    /\/etc\/passwd/, // Detecta /etc/passwd
    /\/bin\//, // Detecta /bin/
  ];
  const isFilePath = patterns.some((pattern) => pattern.test(input));

  if (isFilePath) throw new Error("Input is file path!");
};

const sanitizeOutput = (input: string): string => {
  return validator.escape(input);
};

export { verifyUuid, sanitizeOutput, verifyFilePaths };
