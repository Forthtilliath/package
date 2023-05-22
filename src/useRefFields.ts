import { RefCallback, MutableRefObject, useRef } from "react";

type HTMLFieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/** `useRefForm` creates an object with references to form inputs and
 * provides methods to get and set their values.
 * @param fields - An array of strings representing the form input names for which useRefForm hook
 * will be used.
 * @returns an array containing two elements: the first element is an initialized `useRef`
 * object with an object containing null values for each input, and the second
 * element is an object containing functions to interact with the `useRef` object.
 *
 * Functions include `setRef` to set the reference of an input element to the
 * `useRef`, `getRef` to get the value of a field, `getField` to get the field,
 * `getAllRef` to get an object with the element name as key and to value the
 * element value and `getFormData` to get a ready-to-use FormData be sent.
 *
 * @example
 * useRefForm(['username', 'password'])
 * // => fieldsRef (after initialisation, before setting)
 * {
 *   username: null,
 *   password: null
 * }
 *
 * <input ref={setRef('username')} />
 * // => fieldsRef (allocate the field to key `username`)
 * {
 *   username: HTMLInputElement,
 *   password: null
 * }
 *
 * getField('username') // Get the field with the key `username`
 *
 * getRef('username') // Get the value in the field (like an `input.value`)
 *
 * getAllRef()
 * // Returns the values contained in the fields in the following form
 * {
 *   username: 'myusername',
 *   password: 'secret'
 * }
 *
 * getFormData()
 * // Returns a FormData in the following form
 * [
 *   ['username', 'myusername'],
 *   ['password', 'secret']
 * ]
 */
export function useRefFields<FieldName extends string>(
  fields: ReadonlyArray<FieldName>
) {
  type Fields = Record<FieldName, HTMLFieldElement | null>;

  const initialState = fields.reduce(
    (obj, name: FieldName) => ({ ...obj, [name]: null }),
    {}
  ) as Fields;

  const fieldsRef: MutableRefObject<Fields> = useRef<Fields>(initialState);

  /**
   * `setRef` sends a callback function to set a reference based on a given key.
   * @param {FieldName} key - Key corresponding to a value contained in the array `fields`.
   * @returns `setRef` returns a callback used to update the reference bound to the given key.
   */
  const setRef =
    (key: FieldName): RefCallback<HTMLFieldElement> =>
    (ref: HTMLFieldElement) => {
      if (fields.includes(key)) {
        if (ref.type === "radio") {
          if (fieldsRef.current[key] === null) {
            fieldsRef.current[key] = [ref];
          } else {
            fieldsRef.current[key].push(ref);
          }
        } else {
          fieldsRef.current[key] = ref;
        }
      }
    };

  /**
   * `getRef` returns the value contained in the fieldsRef reference to the given key.
   * @param {FieldName} key - The `key` parameter is used as a key to access a value in the
   * `inputsRef.current` object.
   *
   * @example
   * getRef('username')
   * // johndoe
   */
  const getRef = (key: FieldName): string => {
    assertIsDefined(fieldsRef.current[key], key);

    // Array only for input radios
    if (Array.isArray(fieldsRef.current[key])) {
      return (
        fieldsRef.current[key].find((radio: HTMLInputElement) => radio.checked)
          ?.value ?? ""
      );
    }

    return fieldsRef.current[key]!.value;
  };

  /**
   * `getField` returns the element contained in the fieldsRef reference to the given key.
   * @param {FieldName} key - The `key` parameter is used as a key to access a value in the
   * `inputsRef.current` object.
   *
   * @example
   * getField('username')
   */
  const getField = <T extends HTMLFieldElement = HTMLFieldElement>(
    key: FieldName
  ) => {
    assertIsDefined(fieldsRef.current[key], key);

    return fieldsRef.current[key] as T;
  };

  /**
   * `getAllRef` returns an object containing values from a list of input references.
   *
   * @example
   * getAllRef()
   * // Returns the values contained in the fields in the following form
   * {
   *   username: 'myusername',
   *   password: 'secret'
   * }
   */
  // const getAllRef = () => {
  //   return fields.reduce(
  //     (obj, key) => ({
  //       ...obj,
  //       [key]: getRef(key),
  //       // [key]: fieldsRef.current[key]?.value,
  //     }),
  //     initialState
  //   );
  // };
  const getAllRef = () => {
    return Object.fromEntries(getFormData());
  };

  /**
   * `getFormData` gets form data from input fields and returns it as a FormData object.
   *
   * @example
   * getFormData()
   * // Returns a FormData in the following form
   * [
   *   ['username', 'myusername'],
   *   ['password', 'secret']
   * ]
   */
  const getFormData = () => {
    fields.every((key) => assertIsDefined(fieldsRef.current[key], key));

    return fields.reduce(
      (form, key) => (form.append(key, getRef(key)), form),
      new FormData()
    );
  };

  /**
   * The function checks if a given HTMLFieldElement is not null.
   * @param {T | null} field - The `field` parameter is the HTMLFieldElement to verify.
   * @returns The function `isFieldNotNull` returns a boolean value indicating whether the input
   * `field` is not null. The function also uses a type predicate to narrow the type of `field` to `T`.
   *
   * @example
   * const field = getField(key);
   * if(isFieldNotNull(field)) {
   *   // here field is HTMLFieldElement
   *   // your code
   * } else {
   *   throw new Error(`${key} is null`);
   * }
   */
  const isFieldNotNull = <T extends HTMLFieldElement>(
    field: T | null
  ): field is T => {
    return field !== null;
  };

  const actions = {
    setRef,
    getRef,
    getField,
    getAllRef,
    getFormData,
    isFieldNotNull,
  };
  return [fieldsRef, actions] as const;
}

/**
 * Type of useRefFields actions. `Keys` is a Union Type of the array values
 * passed as arguments to useRefFields.
 *
 * @example
 * export const connexionInputs = ['username', 'password'] as const
 * type Action = UseRefFieldsActions<(typeof connexionInputs)[number]>
 * //^?
 * type Actions = {
 *   setRef: (key: "username" | "password") => RefCallback<HTMLFieldElement>;
 *   getRef: (key: "username" | "password") => string;
 *   getAllRef: () => Record<"username" | "password", HTMLFieldElement | null>;
 *   getFormData: () => FormData;
 * }
 *
 * // To retrieve the specific type of one of the action methods
 * type SetRefField = Actions['setRef']
 * //^?
 * type SetRefField = (key: "username" | "password") => RefCallback<HTMLFieldElement>
 */
export type UseRefFieldsActions<Keys extends string> = ReturnType<
  typeof useRefFields<Keys>
>[1];

/**
 * This function asserts that a value is definite and not null or undefined.
 * @param {T} value - The value that must be checked to be set (not undefined or null).
 * @param {string} key - The key parameter is a string that represents the name or
 * identifier of the variable or property being checked to be set or not. It is used
 * in the error message to indicate which reference is not set.
 */
function assertIsDefined<T>(
  value: T,
  key: string
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`The ${key} reference is not affected!`);
  }
}
