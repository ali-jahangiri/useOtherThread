import { useEffect, useRef, useState } from "react";

const promisify = (callback, args) => {
  return new Promise((res, _) => {
    res(callback(...args));
  });
};

const useOtherThread = (
  callback,
  dependencyList = [],
  shouldRunOnComponentMount = true
) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const runFirst = useRef(false);
  useEffect(() => {
    if (shouldRunOnComponentMount || runFirst.current) {
      setLoading(true);
      promisify(callback, dependencyList).then((data) => {
        setValue(data);
        setLoading(false);
      });
    }
    if (!runFirst.current) runFirst.current = true;
  }, dependencyList);
  return [value, loading];
};

export default useOtherThread;
