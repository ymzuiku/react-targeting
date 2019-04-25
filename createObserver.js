function createObserver(debugName = '__observerBrowerDebugTools__') {
  const observer = {
    values: {},
    fns: {},
    subKeys: {},
    triggers: {},
    subscribe: (key, fn) => {
      if (typeof fn !== 'function') {
        throw new Error('observer.subscribe: fn need typeof function');
      }
      if (!observer.fns[key]) {
        observer.fns[key] = {};
        observer.subKeys[key] = 0;
        observer.triggers[key] = value => {
          observer.browerDebug(key, value);
          for (const k in observer.fns[key]) {
            observer.fns[key][k](value);
          }
          observer.values[key] = value;
        };
      }

      observer.subKeys[key] += 1;

      const k = observer.subKeys[key];

      observer.fns[key][k] = fn;

      return () => {
        if (observer.fns[key][k]) {
          delete observer.fns[key][k];
        }
      };
    },
    browerDebugEvents: [],
    browerDebug: (key, params) => {
      if (typeof window === 'undefined') {
        return;
      }

      if (process.env.NODE_ENV !== 'development') {
        return;
      }

      if (!window[debugName]) {
        window[debugName] = {
          events: id => {
            if (id) {
              // eslint-disable-next-line
              console.table(observer.browerDebugEvents.filter(v => v[1].indexOf(id) > -1));
            } else {
              // eslint-disable-next-line
              console.table(observer.browerDebugEvents);
            }
          },
          values: () => {
            // eslint-disable-next-line
            console.log(observer.values);
          },
          trace: false,
        };
      }

      if (window[debugName].trace === true) {
        // eslint-disable-next-line
        console.trace();
      }

      const time = new Date();
      const t =
        time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds() + 'ms';

      observer.browerDebugEvents.push([t, key, JSON.stringify(params)]);
    },
  };

  observer.subscribe(`__init_${debugName}`, () => {});
  observer.triggers[`__init_${debugName}`](`Welcome ${debugName}`);
  return observer;
}

export default createObserver;
