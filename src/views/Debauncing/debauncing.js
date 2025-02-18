import { useCallback } from 'react';
import debounce from 'lodash.debounce';

const useDebounce = (callback, delay = 500) => {
  return useCallback(debounce(callback, delay), [callback, delay]);
};

export default useDebounce;
