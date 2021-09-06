<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen-core.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen-core)

![min](https://badgen.net/bundlephobia/min/sagen-core@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen-core@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen-core@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen-core@latest)

[Korean](https://github.com/jungpaeng/sagen-core/blob/main/readme-kr.md) | [English](https://github.com/jungpaeng/sagen-core/blob/main/readme.md)

## ⚙ 설치 방법
#### npm
```bash
$ npm install --save sagen-core
```
#### yarn
```bash
$ yarn add sagen-core
```

## 🏃 시작하기

sagen-core는 각각의 store를 정의해서 사용할 수 있는 상태 관리 라이브러리입니다.

### 1. store 만들기

`store`를 생성해 state를 관리할 수 있습니다. store는 다음 기능을 제공합니다.

- reducer를 사용해 store 값을 관리
- computed 함수를 이용해 state 연산
- store state 비교 연산을 관리하여 사용되지 않는 state의 연산 최소화

#### 1-a. createStore

함수가 아닌 값을 `store`에 저장할 수 있습니다.

```typescript
import { createStore } from 'sagen-core';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. state 값 관리

`createStore` 함수는 `getState`, `setState` 함수를 반환합니다.

#### 2-a. getState

`getState` 함수는 `store`의 `state` 값을 반환받습니다.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.getState(); // { num: 0, str: '' }
```

#### 2-b. setState

`getState` 함수는 `store`의 `state` 값을 변경합니다.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.setState({ num: 1, str: 'boo' });
store.getState(); // { num: 1, str: 'boo' }
```

만약, 객체에서 일부 값을 수정해야 한다면 해당 키를 작성해 수정할 수 있습니다.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.setState(({ num: 1 }));
store.getState(); // { num: 1, str: '' }
```

setState의 인자에 함수를 넘겨 현재 값을 받아올 수 있습니다.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ obj: { num: 0, str: '' } });

store.setState(curr => ({
    obj: { ...curr.obj, num: 1 },
}));

store.getState(); // { obj: { num: 1, str: '' } }
```

### 3. redux

`reducer`를 전달해 값을 관리할 수 있습니다.

#### 3-a. pass to reducer

```typescript jsx
const store = createStore(0);
redux<{ type: 'increase' | 'decrease'; by?: number }>(
    store,
    (state, { type, by = 1 }) => {
        switch (type) {
            case 'increase':
                return state + by;
            case 'decrease':
                return state - by;
        }
    },
);
```

#### 3-b. storeDispatch

`redux` 함수는 `dispatch`를 반환합니다.

```typescript jsx
const store = createStore(0);
const storeDispatch = redux<{ type: 'increase' | 'decrease'; by?: number }>(
    store,
    (state, { type, by = 1 }) => {
        switch (type) {
            case 'increase':
                return state + by;
            case 'decrease':
                return state - by;
        }
    },
);

storeDispatch({ type: 'increase' });
store.getState(); // 1
```

#### 4. computed

`state` 값을 바탕으로 `computed value`를 얻을 수 있습니다.

```typescript jsx
const store = createStore({ a: 0, b: 0 });
const storeDispatch = computed(
    store,
    (state) => {
        return {
            ab: state.a + state.b
        };
    },
);

store.setState({ a: 50, b: 100 });
store.getState(); // { a: 50, b: 100 }
store.getComputed(); // { ab: 150 }
```

### 5. event subscribe

업데이트가 발생할 때 event를 실행시킬 수 있습니다.

이 event는 state 값에 영향을 줄 수 없습니다.

#### 5-a. onSubscribe

```ts
import { createStore } from 'sagen-core';

const store = createStore(0);

// event 구독을 취소하는 함수를 반환합니다.
const removeEvent = store.onSubscribe((newState, prevState) => {
  console.log(`prev: ${prevState}, new: ${newState}`);
});

store.setState(1);
// [console.log] prev: 0, new: 1

removeEvent();
store.setState(0);
// [console.log] Empty
```

## React에서 사용하기

`sagen`은 React에서 보다 쉽게 사용할 수 있습니다.

[sagen](https://www.npmjs.com/package/sagen) 라이브러리를 사용해보세요.

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