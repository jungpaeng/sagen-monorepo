<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen-core.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen-core)

![min](https://badgen.net/bundlephobia/min/sagen-core@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen-core@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen-core@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen-core@latest)

[Korean](https://github.com/jungpaeng/sagen-core/blob/main/readme-kr.md) | [English](https://github.com/jungpaeng/sagen-core/blob/main/readme.md)

## ⚙ How to install
#### npm
```bash
$ npm install --save sagen-core
```
#### yarn
```bash
$ yarn add sagen-core
```

## 🏃 Getting started

sagen-core is a state management library that combines each store without a root store.

### 1. Create a store

You can manage the state by creating a `store`. The store offers the following features:

-Create a single store by combining multiple stores
-Standardize store management with a pattern similar to reducer
-Minimize operation of unused state by managing store state comparison operation

#### 1-a. createStore

Non-function values can be stored in `store`.

```typescript
import { createStore } from 'sagen-core';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. State value management

The `createStore` function returns the `getState` and `setState` functions.

#### 2-a. getState

The `getState` function returns the `state` value of `store`.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.getState(); // { num: 0, str: '' }
```

#### 2-b. setState

The `getState` function changes the `state` value of `store`.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.setState({ num: 1, str: 'boo' });
store.getState(); // { num: 1, str: 'boo' }
```

If you need to modify the value using the current `state` value, you can pass the `(curr: State) => State` function.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.setState(curr => ({ ...curr, num: 1 }));
store.getState(); // { num: 1, str: '' }
```

### 3. Dispatch

You can manage it by adding a `action` to the `store` created with the `createStore` function.

#### 3-a. setAction

Before using `Dispatch`, you need to define `Action`.

```typescript jsx
const store = createStore(0);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

#### 3-a. createDispatch

The `dispatch` function passes the value created through `action` as an argument.

```typescript jsx
const store = createStore(0);
const storeDispatch = createDispatch(store);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

```typescript jsx
storeDispatch(storeAction.INCREMENT)
storeDispatch(storeAction.ADD, 100)
```


### 4. middleware

**sagen is compatible with Redux middleware.**

#### 4-a. composeMiddleware

Here is a simple logger middleware.

You can combine multiple `middleware` using `composeMiddleware`, and pass it to the second argument of `createStore`.

```ts
import { createStore, composeMiddleware } from 'sagen-core';

const loggerMiddleware = store => next => action => {
  console.log('current state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));
store.setState(1);
```

**console log**

```console
current state,  0
action, 1
next state,  1
```

### 5. Subscribe to events

You can trigger an event when an update occurs.

This event cannot affect the state value.

#### 5-a. onSubscribe

```ts
import { createStore } from 'sagen-core';

const store = createStore(0);

// Returns a function that unsubscribes from event.
const removeEvent = store.onSubscribe((newState, prevState) => {
  console.log(`prev: ${prevState}, new: ${newState}`);
});

store.setState(1);
// [console.log] prev: 0, new: 1

removeEvent();
store.setState(0);
// [console.log] Empty
```

### 6. Store merging

Multiple `stores' can be combined and managed as a single `store`.

If you wish, you can also create and manage a single Root Store.

#### 6-a. composeStore

With `composeStore`, you can group `store` into a single `store`.

The integrated store is in a state of subscribing to the original store.

Changing values in one store affects values in other stores.

```typescript jsx
import { composeStore } from 'sagen-core';

const numStoreA = createStore(0);
const numStoreB = createStore(0);

const { store: numStoreAB } = composeStore({
  a: numStoreA,
  b: numStoreB,
});

numStoreAB.setState({ a: 1, b: 0 });

numStoreA.getState(); // 1
```

## Using in React

`sagen` is easier to use in React.

Try the [sagen](https://www.npmjs.com/package/sagen) library.

## 📜 License
sagen-core is released under the [MIT license](https://github.com/jungpaeng/sagen-core/blob/main/LICENSE).

```
Copyright (c) 2021 jungpaeng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```