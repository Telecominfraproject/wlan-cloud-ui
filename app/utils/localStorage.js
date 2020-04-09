export const isItemExpired = value => {
  if (value.expiration && Date.now() < value.expiration) {
    return false;
  }
  return true;
};

export const getItemExpiration = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.getTime();
};

export const setItem = (key, data, expiration) => {
  const localStorageState = data;
  localStorageState.expiration = expiration || getItemExpiration();
  window.localStorage.setItem(key, JSON.stringify(localStorageState));
};

export const removeItem = key => {
  window.localStorage.removeItem(key);
};

export const getItem = key => {
  let value = null;
  try {
    value = JSON.parse(window.localStorage.getItem(key));
  } catch (err) {
    return null;
  }

  if (isItemExpired(value)) {
    return removeItem(key);
  }

  return value;
};
