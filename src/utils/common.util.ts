export const uuidv4 = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const formatMilliseconds = (ms: number) => {
  return `${ms}ms`;
};
export const generateCID = (cid?: string) => {
  return cid || uuidv4();
};

export const getTimestamp = () => new Date().getTime();
