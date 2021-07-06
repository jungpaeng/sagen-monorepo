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

sagen-core는 root store가 없는 각각의 store를 조합해서 사용하는 상태 관리 라이브러리입니다.

### 1. store 만들기

`store`를 생성해 state를 관리할 수 있습니다. store는 다음 기능을 제공합니다.

- 여러 store를 조합해서 하나의 store를 생성
- reducer와 유사한 패턴으로 store 관리 정형화
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

만약, 현재의 `state` 값을 이용해 값을 수정해야 한다면 `(curr: State) => State` 함수를 넘기면 됩니다.

```typescript
import { createStore } from 'sagen-core';

const store = createStore({ num: 0, str: '' });

store.setState(curr => ({ ...curr, num: 1 }));
store.getState(); // { num: 1, str: '' }
```

### 3. Dispatch

`createStore` 함수로 생성한 `store`에 `action`을 추가해 관리할 수 있습니다.

#### 3-a. setAction

`Dispatch`를 이용하기 전, `Action`을 정의해야 합니다.

```typescript jsx
const store = createStore(0);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

#### 3-a. createDispatch

`dispatch` 함수는 인자로 `action`을 통해 만든 값을 전달합니다.

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

**sagen은 Redux의 미들웨어를 호환합니다.**

#### 4-a. composeMiddleware

다음은 간단한 logger middleware 입니다.

`composeMiddleware`를 사용해 여러 `middleware`를 조합할 수 있으며, `createStore`의 두 번째 인자에 넘깁니다.

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

**console log**

```console
현재 상태,  0
액션, 1
다음 상태,  1
```

### 5. 이벤트 구독

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

### 6. Store 합치기

여러 `store`를 합쳐 하나의 `store`로 관리할 수 있습니다.

원한다면 하나의 Root Store를 만들어 관리할 수도 있습니다.

#### 6-a. composeStore

`composeStore`로 `store`를 하나의 `store`로 묶을 수 있습니다.

통합된 store는 원본 store와 서로 구독하고 있는 상태입니다. 한 store의 값 변경은 다른 store의 값에 영향을 줍니다.

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