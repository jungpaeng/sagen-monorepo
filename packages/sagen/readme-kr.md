<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen)
[![Maintainability](https://api.codeclimate.com/v1/badges/0c2a4ad6c9ad60f3b2cf/maintainability)](https://codeclimate.com/github/jungpaeng/sagen/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0c2a4ad6c9ad60f3b2cf/test_coverage)](https://codeclimate.com/github/jungpaeng/sagen/test_coverage)

![min](https://badgen.net/bundlephobia/min/sagen@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen@latest)

[Korean](https://github.com/jungpaeng/sagen/blob/main/readme-kr.md) | [English](https://github.com/jungpaeng/sagen/blob/main/readme.md)

## ⚙ 설치 방법
#### npm
```bash
$ npm install --save sagen
```
#### yarn
```bash
$ yarn add sagen
```

## 🏃 시작하기

sagen는 root store가 없는 각각의 store를 조합해서 사용하는 상태 관리 라이브러리입니다.

### 1. store 만들기

`store`를 생성해 state를 관리할 수 있습니다. store는 다음 기능을 제공합니다.

- React에서 사용시 state 변화 감지
- 여러 store를 조합해서 하나의 store를 생성
- reducer와 유사한 패턴으로 store 관리 정형화
- store state 비교 연산을 관리하여 사용되지 않는 state의 연산 최소화

#### 1-a. createStore

함수가 아닌 값을 `store`에 저장할 수 있습니다.

```typescript
import { createStore } from 'sagen';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. state 값 관리

`createStore` 함수는 `getState`, `setState` 함수를 반환합니다.

React에서는 `useSagenStore`, `useSagenState`, `useSetSagenState`를 사용해서 값을 관리할 수 있습니다.

#### 2-a. useSagenStore

`useSagenStore` Hook은 `getter`와 `setter`를 배열로 반환합니다.

`React.useState` Hook과 사용 방법이 동일합니다.

다른 컴포넌트에서의 변경사항을 `getter`로 받아올 수 있다는 것만 다릅니다. 

```typescript jsx
import { createStore, useSagenStore } from 'sagen';

const store = createStore(0);

function Test() {
  const [num, setNum] = useSagenStore(store);
  
  const incrementNum = () => {
    setNum(curr => curr + 1);
  };
  
  return (
    <div>
      <p>num: {num}</p>
      <button onClick={incrementNum}>
        Increment
      </button>
    </div>
  );
}
```

#### 2-b. useSagenState

`useSagenState` Hook은 `store`의 `getter`를 반환합니다.

```typescript jsx
import { createStore, useSagenState } from 'sagen';

const store = createStore(0);

function Test() {
  const num = useSagenState(store);

  return (
    <p>num: {num}</p>
  );
}
```

#### 2-c. useSetSagenState

`useSetSagenState` Hook은 `store`의 `setter`를 반환합니다.

```typescript jsx
import { createStore, useSetSagenState } from 'sagen';

const store = createStore(0);

function Test() {
  const setNum = useSagenState(store);

  const incrementNum = () => {
    setNum(curr => curr + 1);
  };

  return (
    <button onClick={incrementNum}>
      Increment
    </button>
  );
}
```

#### 2-1. getter

`getter`를 반환하는 `useSagenStore`와 `useSagenState`에 인자를 넘겨 추가적인 기능을 사용할 수 있습니다.

이것은 대부분 퍼포먼스 최적화를 위해 사용됩니다.

##### 2-1-a. selector

`useSagenStore`와 `useSagenState`에 `selector`를 넘길 수 있습니다.

이는 주로 객체 store에 사용되며, 객체 값 중 원하는 값만을 구독할 수 있도록 합니다.

구독한 값은 `getter`에만 영향을 끼치며, `setter`에서는 원본 값에 대한 정보를 갖고 있습니다.

sagen은 컴포넌트가 구독하고 있는 값에 대해서만 연산을 하므로 사용하지 않는 값이라면 구독하지 않는 것이 좋습니다.

```typescript jsx
import { createStore, useSagenStore } from 'sagen';

const infoStore = createStore({
  name: 'jungpaeng',
  age: 22,
});

const ageSelector = store => store.age;

function Test() {
  // 컴포넌트에서 age 값만을 사용하므로 ageSelector를 넘깁니다.
  const [age, setInfo] = useSagenStore(infoStore, ageSelector);

  const incrementAge = () => {
    setInfo(curr => ({ ...curr, age: curr.age + 1 }));
  };

  return (
    <div>
      <p>age: {age}</p>
      <button onClick={incrementAge}>
        Increment
      </button>
    </div>
  );
}
```

##### 2-1-b. equalityFn

`useSagenStore`와 `useSagenState`에 `equalityFn`을 넘길 수 있습니다.

컴포넌트의 구독된 값이 변경되었는지 감지하는 데 사용됩니다.

기본적으로 `===`를 사용해서 비교하며, 배열, 객체 등의 비교를 위해 `shallowEqual`을 제공합니다. 

```typescript jsx
import { createStore, useSagenStore, shallowEqual } from 'sagen';

const infoStore = createStore({
  name: 'jungpaeng',
  use: 'typescript',
  age: 22,
});

const selector = store => ({ name: store.name, age: store.age });

function Test() {
  // 구독하지 않은 use 값이 변하더라도 컴포넌트는 반응하지 않습니다.
  const [info, setInfo] = useSagenStore(infoStore, selector, shallowEqual);

  const incrementAge = () => {
    setInfo(curr => ({ ...curr, age: curr.age + 1 }));
  };

  return (
    <div>
      <p>name: {info.name}</p>
      <p>age: {info.age}</p>
      <button onClick={incrementAge}>
        Increment
      </button>
    </div>
  );
}
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
```

### 4. computed

`state` 값을 바탕으로 `computed value`를 얻을 수 있습니다.

```typescript jsx
const store = createStore({ a: 0, b: 0 });
const computedStore = computed(
    store,
    (state) => {
        return {
            ab: state.a + state.b
        };
    },
);

computedStore.setState({ a: 50, b: 100 });
computedStore.getState(); // { a: 50, b: 100 }
computedStore.getComputed(); // { ab: 150 }
```

#### 4-a. useComputed

`computed` 값을 가져오기 위해 `useComputed` Hook을 사용합니다.

```typescript jsx
const store = computed(createStore({ a: 0, b: 0 }), (state) => state.a + state.b);
const [state, setState] = useSagenStore(store);
const computed = useComputed(store);

// state: { a: 0, b: 0 }
// computed: 0
```

#### 4-b. useComputed with selector

`useComputed` Hook에 `selector` 및 `equalityFn`을 인자로 넘길 수 있습니다.

```typescript jsx

const store = computed(createStore({ a: 0, b: 0 }), (state) => ({
    sum: state.a + state.b,
    isEnough: (state.a + state.b) > 100 ? 'enough' : 'not enough',
}));
const [state, setState] = useSagenStore(store);
const computed = useComputed(store, computed => computed.sum);

// state: { a: 0, b: 0 }
// computed: 0
```

### 5. 이벤트 구독

업데이트가 발생할 때 event를 실행시킬 수 있습니다.

이 event는 state 값에 영향을 줄 수 없습니다.

#### 5-a. onSubscribe

```ts
import { createStore } from 'sagen';

const store = createStore(0);

// event 구독을 취소하는 함수를 반환합니다.
const removeEvent = store.onSubscribe((newState, prevState) => {
  console.log(`prev: ${prevState}, new: ${newState}`);
});

// 컴포넌트 내부에서..
const [state, setState] = useSagenStore(store);
setState(1);
// [console.log] prev: 0, new: 1

removeEvent();
setState(0);
// [console.log] Empty
```

## React 없이 사용하기

`sagen`은 React 없이 사용할 수 있습니다.

[sagen-core](https://www.npmjs.com/package/sagen-core) 라이브러리를 사용해보세요.

## 📜 License
sagen is released under the [MIT license](https://github.com/jungpaeng/sagen/blob/main/LICENSE).

```
Copyright (c) 2020 jungpaeng

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
