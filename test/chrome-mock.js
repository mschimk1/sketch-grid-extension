let store = {};

function resolveKey(key) {
  if (typeof key === 'string') {
    const result = {};
    result[key] = store[key];
    return result;
  }
  return store;
}

const chrome = {
  tabs: {
    executeScript: jest.fn(),
    onUpdated: { addListener: jest.fn() },
    onRemoved: { addListener: jest.fn() },
    query: jest.fn((_, cb) => cb([{ id: 1 }])),
    sendMessage: jest.fn()
  },
  runtime: {
    id: true,
    openOptionsPage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn()
  },
  extension: {
    getBackgroundPage: jest.fn()
  },
  storage: {
    local: {
      get: jest.fn((id, cb) => {
        const result = id === null ? store : resolveKey(id);
        if (cb !== undefined) {
          return cb(result);
        }
        return Promise.resolve(result);
      }),
      set: jest.fn((payload, cb) => {
        Object.keys(payload).forEach(key => (store[key] = payload[key]));
        if (cb !== undefined) {
          return cb();
        }
        return Promise.resolve();
      }),
      clear: jest.fn(cb => {
        store = {};
        if (cb !== undefined) {
          return cb();
        }
        return Promise.resolve();
      }),
      remove: jest.fn()
    },
    onChanged: { addListener: jest.fn() }
  }
};

global.chrome = chrome;
