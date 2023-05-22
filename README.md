# react-useRefFields

[![github version](https://img.shields.io/github/package-json/v/Forthtilliath/react-usereffields?color=success)](https://img.shields.io/github/package-json/v/Forthtilliath/react-usereffields) [![github repo size](https://img.shields.io/github/repo-size/Forthtilliath/react-usereffields)](https://img.shields.io/github/repo-size/Forthtilliath/react-usereffields) [![npm download](https://img.shields.io/npm/dt/react-usereffields)](https://img.shields.io/npm/dt/react-usereffields) [![licence](https://img.shields.io/npm/l/react-usereffields)](https://img.shields.io/npm/l/react-usereffields)

The react-useRefFields package is a library that provides a React hook called useRefFields. This hook allows you to manage form field references in a React component. It returns an array containing two elements: an object that contains the references for each field, and an object that contains functions to interact with these references.

The useRefFields hook is useful for simplifying the management of form fields in a React component. It makes it easy to define references for each field and to interact with these references in a consistent way. The react-useRefFields package is easy to use and can be installed via NPM, Yarn or PNPM.

## Install

Install it from npm and include it in your React build process

```bash
npm install react-usereffields
```

or from yarn:

```bash
yarn add react-usereffields
```

or from pnpm:

```bash
pnpm install react-usereffields
```

## Usage

Here are some examples of how you can use the useRefFields hook:

##### JSX

```jsx
import { useRefFields } from "react-usereffields";

export function MyForm() {
  const [
    fieldsRef,
    { setRef, getRef, getField, getAllRef, getFormData, isFieldNotNull },
  ] = useRefFields(["username", "password", "gender", "message", "age"]);

  const handleSubmit = () => {
    const usernameField = getField("username");
    if (isFieldNotNull(usernameField)) {
      console.log(usernameField.value);
    }
    console.log(getRef("age"));
    console.log(getAllRef());
    console.log(Object.fromEntries(getFormData()));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Examples with inputs */}
      <input type="text" ref={setRef("username")} placeholder="Username" />
      <input type="password" ref={setRef("password")} placeholder="Password" />

      {/* Examples with input radio */}
      <label>
        <span>Minor:</span>
        <input type="radio" name="age" ref={setRef("age")} value="minor" />
      </label>
      <label>
        <span>Minor:</span>
        <input type="radio" name="age" ref={setRef("age")} value="major" />
      </label>

      {/* Examples with select */}
      <select ref={setRef("gender")} defaultValue={"default"}>
        <option value="default" disabled>
          Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <textarea ref={setRef("message")} placeholder="Message" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

##### TSX

```tsx
import { useRefFields } from "react-usereffields";

export function MyForm() {
  const [
    fieldsRef,
    { setRef, getRef, getField, getAllRef, getFormData, isFieldNotNull },
  ] = useRefFields(["username", "password", "gender", "message", "age"]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = () => {
    const usernameField = getField("username");
    if (isFieldNotNull(usernameField)) {
      console.log(usernameField.value);
    }
    console.log(getRef("age"));
    console.log(getAllRef());
    console.log(Object.fromEntries(getFormData()));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Examples with inputs */}
      <input type="text" ref={setRef("username")} placeholder="Username" />
      <input type="password" ref={setRef("password")} placeholder="Password" />

      {/* Examples with input radio */}
      <label>
        <span>Minor:</span>
        <input type="radio" name="age" ref={setRef("age")} value="minor" />
      </label>
      <label>
        <span>Minor:</span>
        <input type="radio" name="age" ref={setRef("age")} value="major" />
      </label>

      {/* Examples with select */}
      <select ref={setRef("gender")} defaultValue={"default"}>
        <option value="default" disabled>
          Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <textarea ref={setRef("message")} placeholder="Message" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

In the example above, we are creating a form with :

- two input fields : `username` and `password`;
- a radio selection for the `age`;
- a selection field for the `gender`;
- a text box for the `message`.

We create a reference to each input field using the `setRef` function. When the user clicks the submit button, we log the values of the username field after to have check if the field is defined (with `setRef`), the age field, all fields, and the form data.

## useRefFields return

The hook returns an array containing two elements:

- The first element is an initialized `useRef` object with an object containing null values for each input.
- The second element is an object containing functions to interact with the `useRef` object.

### First key : refs

The first element is the reference which contains all fields. You can access them in the following way :

##### JSX / TSX

```tsx
const [myFormRef, actions] = useRefFields(myFields);

const checkInput = () => {
  // Focus the input if it's empty
  // myInput has the type HTMLFieldElement | null
  // HTMLFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  const myInput = refs.current.username;
  if (myInput && myInput.value === "") {
    myInput.focus();
  }
};
```

### Second key : actions

The second element is an object which contains all actions.

#### setRef

`setRef` returns a callback used to update the reference bound to the given key.

##### JSX / TSX

```tsx
<input type="text" ref={setRef("username")} placeholder="Username" />
```

#### getRef

`getRef` returns the value contained in the fieldsRef reference to the given key. An input radio will return an empty string.

##### JSX / TSX

```tsx
const [, { getRef }] = useRefFields(["username", "password"]);

const handleSubmit = () => {
  console.log(getRef("username"));
};
```

#### getField

`getField` returns the element contained in the fieldsRef reference to the given key. An input radio will return an array of input which contains HTMLInputElement from the given key.

##### JSX

```jsx
const [, { getField }] = useRefFields(["username", "password"]);

const checkInput = () => {
  const myUsernameInput = getField("username");
  if (myUsernameInput.value === "") {
    myUsernameInput.focus();
  }
};
```

##### TSX

```tsx
const [, { getField }] = useRefFields(["username", "password"]);

const checkInput = () => {
  const myUsernameInput = getField<HTMLInputElement>("username");
  if (myUsernameInput.value === "") {
    myUsernameInput.focus();
  }
};
```

#### getAllRef

`getAllRef` returns an object containing values from a list of input references.

##### JSX / TSX

```tsx
const [, { getAllRef }] = useRefFields(["username", "password"]);

const handleSubmit = () => {
  console.log(getAllRef());
};
```

#### getFormData

`getFormData` gets form data from input fields and returns it as a FormData object.

##### JSX / TSX

```tsx
const [, { getFormData }] = useRefFields(["username", "password"]);

const handleSubmit = () => {
  console.log(Object.fromEntries(getFormData()));
};
```

#### isFieldNotNull

`isFieldNotNull` is a function that checks if a given HTMLFieldElement is not null.

##### JSX

```jsx
const focusIfEmpty = (key) => {
  const field = getField(key);
  if (isFieldNotNull(field)) {
    if (field.value === "") field.focus();
  } else {
    throw new Error(`The field with ${key} key is null`);
  }
};
```

##### TSX

```tsx
const focusIfEmpty = (key: (typeof inputsName)[number]) => {
  const field = getField(key);
  if (isFieldNotNull(field)) {
    if (field.value === "") field.focus();
  } else {
    throw new Error(`The field with ${key} key is null`);
  }
};
```

## Utility types

### UseRefFieldsActions

The `UseRefFieldsActions` type helps to get the return type of the second parameter of the hook. This can be useful when you pass `setRef` to a child.

##### TSX

```tsx
// In your form component
export const connexionInputs = ["username", "password"] as const;

// In your child component
import { UseRefFieldsActions } from "react-usereffields";

// Action contains all actions type
type Action = UseRefFieldsActions<(typeof connexionInputs)[number]>;

type Props = {
  // Note the setRef to get only the type of the methode setRef
  setRef: Action["setRef"];
  // Same than
  setRef: UseRefFieldsActions<(typeof connexionInputs)[number]>["setRef"];
};
```
