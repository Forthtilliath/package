# react-useRefFields

[![npm version](https://badge.fury.io/js/react-usereffields.svg)](https://badge.fury.io/js/react-usereffields)

Simple React hook to manage form fields.

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

You can either use the hook:

```tsx
import { UseRefFieldsActions } from "react-usereffields";
import styles from "./DeckForm.module.css";

export function SignUpForm() {
  const [, { setRef, getFormData }] = useRefFields([
    "username",
    "password",
    "gender",
    "message",
  ]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    // Do something with the data
    console.log(Object.fromEntries(getFormData()));
    // => { username: 'forthtilliath', password: 'secret', gender: 'male', message: 'it works!!!'}
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" ref={setRef("username")} placeholder="Username" />
      <input type="password" ref={setRef("password")} placeholder="Password" />
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

## useRefFields return

useRefFields returns an array.

### First key : refs {.tabset}

The first element is the reference which contains all fields. You can access them in the following way :


#### JSX
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
#### TSX
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

```tsx
const [, { getField }] = useRefFields(myFields);

const checkInput = () => {
  const myUsernameInput = getField<HTMLInputElement>("username");
  if (myUsernameInput.value === "") {
    myUsernameInput.focus();
  }
};
```
