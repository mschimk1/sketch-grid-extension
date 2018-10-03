let StorageMock = () => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {})
  };
};

Object.defineProperty(window, 'localStorage', {
  value: StorageMock()
});

Object.defineProperty(window, 'sessionStorage', {
  value: StorageMock()
});
