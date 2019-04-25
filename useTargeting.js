import observer from './observer';
import { useCallback, useState, useLayoutEffect, useRef } from 'react';

export default (id, defaultValue, update) => {
  const [value, setValue] = useState(observer.values[id] || defaultValue);
  const subscribe = useRef(null);

  useLayoutEffect(() => {
    // 如果历史有subscribe, 则清除
    if (typeof subscribe.current === 'function') {
      subscribe.current();
    }

    subscribe.current = observer.subscribe(id, setValue);
    return subscribe.current;
  }, [id]);

  const targeting = useCallback(
    params => {
      function updateValue(v) {
        if (observer.triggers[id]) {
          observer.triggers[id](v);
        }
      }
      if (typeof update === 'function') {
        update(updateValue, value, params);
      } else {
        updateValue(params);
      }
    },
    [id],
  );

  return [value, targeting];
};
