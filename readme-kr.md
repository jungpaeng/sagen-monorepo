<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen-core)

![min](https://badgen.net/bundlephobia/min/sagen-core@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen-core@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen-core@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen-core@latest)

[Korean](https://github.com/jungpaeng/sagen-core/blob/main/readme-kr.md) | [English](https://github.com/jungpaeng/sagen-core/blob/main/readme.md)

## ⚙ 설치 방법
### npm
```bash
$ npm install --save sagen-core
```
### yarn
```bash
$ yarn add sagen-core
```

## 🏃 시작하기

### store 만들기

store를 생성해 state를 관리할 수 있습니다!

```typescript
import { createStore } from 'sagen-core';

const globalStore = createStore(0);

globalStore.setState(1);
globalStore.getState(); // 1

globalStore.setState(10);
globalStore.getState(); // 10
```

### state 값 관리

```html
<div id="app">
  <p class="num"></p>
  <button class="add-num">click me</button>
</div>
```

```jsx
import { createStore } from "sagen-core";

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

### getState

현재 store에 저장되어 있는 값을 가져옵니다.

### setState

store에 저장되어 있는 값을 업데이트합니다.

```jsx
store.setState(10); // store에 저장된 값을 10으로 변경합니다.
store.setState(curr => curr + 10); // store에 저장된 값에 10을 더합니다.
```

### setAction, Reducer 패턴

`setAction` 함수를 이용해 `setState`를 커스터마이징 할 수 있습니다.

```typescript jsx
import { createStore, createDispatch } from 'sagen-core';

const numStore = createStore(0);
const numDispatch = createDispatch(numStore);

const action = numStore.setAction(get => ({
  ADD: (num) => get() + num,
  INCREMENT: () => get() + 1,
}));

numDispatch(action.INCREMENT); // 1
numDispatch(action.ADD, 10);   // 11
```

### middleware for sagen-core

**sagen은 Redux의 미들웨어를 호환합니다.**

다음은 redux의 간단한 logger middleware 입니다.

```ts
import { createStore, composeMiddleware } from 'sagen-core';

const loggerMiddleware = store => next => action => {
  console.log('현재 상태', store.getState());
  console.log('액션', action);
  next(action);
  console.log('다음 상태', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));
store.setState(1);
```

console log

```console
현재 상태,  0
액션, 1
다음 상태,  1
```

### React와 사용하기

[sagen](https://www.npmjs.com/package/sagen) 라이브러리를 사용해 React에서 사용할 수 있습니다.

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
