export type TUseLocalStorage<T> = [
  () => T | undefined,
  (value: T) => void,
  () => void
];

/**
 * @description A custom hook that provides methods to interact with the local storage.
 * @template T - The type of the value to be stored in the local storage.
 * @param {string} key - The key to be used to store the value in the local storage.
 * @returns {TUseLocalStorage} - An object containing methods to set, get and remove the value from the local storage.
 */
export function useLocalStorage<T>(key: string): TUseLocalStorage<T> {
  /**
   * @description A function to set the value in the local storage.
   * @param {T} value - The value to be stored in the local storage.
   * @returns {void}
   */
  const setItem = (value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      window.console.log(error);
    }
  };

  /**
   * @description A function to get the value from the local storage.
   * @returns {T | undefined} - The value retrieved from the local storage, or undefined if an error occurred.
   */
  const getItem = (): T | undefined => {
    try {
      const item = window.localStorage.getItem(key);

      if (item === null) return undefined;

      return JSON.parse(item);
    } catch (error) {
      window.console.log(error);

      return undefined;
    }
  };

  /**
   * @description A function to remove the value from the local storage.
   * @returns {void}
   */
  const removeItem = (): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      window.console.log(error);
    }
  };

  return [getItem, setItem, removeItem];
}
