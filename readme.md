<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen-core)

![min](https://badgen.net/bundlephobia/min/sagen-core@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen-core@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen-core@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen-core@latest)

[Korean](./readme-kr.md) | [English](./readme.md)

## ⚙ Install
#### npm
```bash
$ npm install --save sagen-core
```
#### yarn
```bash
$ yarn add sagen-core
```

## 🏃 Sagen

#### Create a store

You can create a store to manage the state!

```typescript
import { createStore } from 'sagen-core';

const globalStore = createStore(0);

globalStore.setState(1);
globalStore.getState(); // 1

globalStore.setState(10);
globalStore.getState(); // 10
```

#### management of state value

```html
<div id="app">
  <p class="num"></p>
  <button class="add-num">click me</button>
</div>
```

```jsx
import createStore from "sagen-core";

const numStore = createStore(0);

const numText = document.querySelector(".num");
const addNumButton = document.querySelector(".add-num");

numText.innerHTML = numStore.getState();

addNumButton.addEventListener("click", function () {
  numStore.setState((curr) => curr + 1);
});

numStore.onSubscribe((newState, prevState) => {
  console.log("changed " + prevState + " to " + newState);
  numText.textContent = newState;
});
```

## Recipes

#### getState

Gets the value currently stored in the store.

#### setState

Update the value stored in the store.

```jsx
store.setState(10); // Change the value stored in store to 10.
store.setState(curr => curr + 10); // Add 10 to the value stored in store.
```

#### addAction, dispatch

You can customize `setState` using `addAction` and `dispatch` functions.

```typescript jsx
const numStore = createStore(0);
const numDispatch = createDispatch(numStore);

numStore.addAction(get => ({
  ADD: num => get() + num,
  INCREMENT: () => get() + 1,
}));

numDispatch('INCREMENT'); // 1
numDispatch('ADD', 10);   // 11
```

#### Using with React

You can use it in React using the [sagen](https://www.npmjs.com/package/sagen) library.

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
