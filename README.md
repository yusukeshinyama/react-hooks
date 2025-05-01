# ゼロから作るreact-hooksもどき

## 概要

「フック (hooks)」の概念は Reactプログラミングにおける基本である。
ここでは、Reactの基本的なフック (`useState`と`useEffect`) を 
TypeScript を使って実装してみる
(実装するのはフックだけである - Virtual DOM などは実装しないので
「Reactもどき」として使えるものではない)。


## useState

1. 最初のテスト (`value` は変数でなく関数):

```typescript
describe('useState', () => {

  it('Holds the initial value.', () => {
    const initialValue = 123;
    const [value, setValue] = useState(initialValue)

    expect(value()).toBe(initialValue)
  })

  it('SetValue changes the value.', () => {
    const initialValue = 123;
    const changedValue = 456;
    const [value, setValue] = useState(initialValue)

    setValue(changedValue)
    expect(value()).toBe(changedValue)
  })

})
```

2. `value`が変数になるよう改良する。
   `useState`の値は、所属するコンポーネントが再レンダリングされるときに更新されるものとする。

```typescript
describe('useState', () => {

  it('Holds the initial value.', () => {
    const state = {} as State<number>
    const initialValue = 123;
    const [value, setValue] = useState(state, initialValue)

    expect(value).toBe(initialValue)
  })

  it('SetValue changes the value.', () => {
    const initialValue = 123;
    const changedValue = 456;
    const component = (state: State<number>) => {
      const [value, setValue] = useState(state, initialValue)
      const buttonClick = () => {
        setValue(changedValue)
      }
      return {value, buttonClick}
    }

    const state = {} as State<number>
    const render1 = component(state)
    expect(render1.value).toBe(initialValue)
    render1.buttonClick()
    const render2 = component(state)
    expect(render2.value).toBe(changedValue)
  })

})
```
3. 別々の `useState` はそれぞれ独立している。

```typescript
describe('useState', () => {

  it('Holds the initial value.', () => {
    const context = {} as Context
    const initialValue = 123;
    const component = (context: Context) => {
      const [value, setValue] = useState(context, initialValue)
      return {value}
    }

    const screen1 = render(context, component)
    expect(screen1.value).toBe(initialValue)
  })

  it('SetValue changes the value.', () => {
    const initialValue = 123;
    const changedValue = 456;
    const component = (context: Context) => {
      const [value, setValue] = useState(context, initialValue)
      const buttonClick = () => {
        setValue(changedValue)
      }
      return {value, buttonClick}
    }

    const context = {} as Context
    const screen1 = render(context, component)
    expect(screen1.value).toBe(initialValue)
    screen1.buttonClick()
    const screen2 = render(context, component)
    expect(screen2.value).toBe(changedValue)
  })

  it('Multiple useStates are independent.', () => {
    const initialValue = 123;
    const changedValueA = 456;
    const changedValueB = 789;
    const component = (context: Context) => {
      const [valueA, setValueA] = useState(context, initialValue)
      const [valueB, setValueB] = useState(context, initialValue)
      const buttonClickA = () => {
        setValueA(changedValueA)
      }
      const buttonClickB = () => {
        setValueB(changedValueB)
      }
      return {valueA, valueB, buttonClickA, buttonClickB}
    }

    const context = {} as Context
    const screen1 = render(context, component)
    screen1.buttonClickA()
    screen1.buttonClickB()
    const screen2 = render(context, component)
    expect(screen2.valueA).toBe(changedValueA)
    expect(screen2.valueB).toBe(changedValueB)
  })

})
```

4. 各コンポーネントに `Context` を渡す必要がないようにする。

```typescript
describe('useState', () => {

  it('Holds the initial value.', () => {
    const initialValue = 123;
    const component = () => {
      const [value, setValue] = useState(initialValue)
      return {value}
    }

    const screen1 = render(component)
    expect(screen1.value).toBe(initialValue)
  })

  it('SetValue changes the value.', () => {
    const initialValue = 123;
    const changedValue = 456;
    const component = () => {
      const [value, setValue] = useState(initialValue)
      const buttonClick = () => {
        setValue(changedValue)
      }
      return {value, buttonClick}
    }

    const screen1 = render(component)
    expect(screen1.value).toBe(initialValue)
    screen1.buttonClick()
    const screen2 = render(component)
    expect(screen2.value).toBe(changedValue)
  })

  it('Multiple useStates are independent.', () => {
    const initialValue = 123;
    const changedValueA = 456;
    const changedValueB = 789;
    const component = () => {
      const [valueA, setValueA] = useState(initialValue)
      const [valueB, setValueB] = useState(initialValue)
      const buttonClickA = () => {
        setValueA(changedValueA)
      }
      const buttonClickB = () => {
        setValueB(changedValueB)
      }
      return {valueA, valueB, buttonClickA, buttonClickB}
    }

    const screen1 = render(component)
    screen1.buttonClickA()
    screen1.buttonClickB()
    const screen2 = render(component)
    expect(screen2.valueA).toBe(changedValueA)
    expect(screen2.valueB).toBe(changedValueB)
  })

})
```

5. 別々のコンポーネントに所属する `useState` はそれぞれ独立している。

```typescript
it('Multiple components are independent.', () => {
  const initialValue = 123;
  const changedValueA = 456;
  const changedValueB = 789;
  const componentA = () => {
    const [valueA, setValueA] = useState(initialValue)
    const buttonClickA = () => {
      setValueA(changedValueA)
    }
    return {valueA, buttonClickA}
  }
  const componentB = () => {
    const [valueB, setValueB] = useState(initialValue)
    const buttonClickB = () => {
      setValueB(changedValueB)
    }
    const {valueA, buttonClickA} = render(componentA)
    return {valueA, valueB, buttonClickA, buttonClickB}
  }

  const screen1 = render(componentB)
  screen1.buttonClickA()
  screen1.buttonClickB()
  const screen2 = render(componentB)
  expect(screen2.valueA).toBe(changedValueA)
  expect(screen2.valueB).toBe(changedValueB)
})
```

6. カスタムフックも動く!

```typescript
it('Custom hooks work too!', () => {
  const initialValue = 123;
  const changedValueA = 456;
  const useFoo = (initialValue, changedValue) => {
    const [value, setValue] = useState(initialValue)
    const buttonClick = () => {
      setValue(changedValueA)
    }
    return {value, buttonClick}
  }
  const component = () => {
    const {value, buttonClick} = useFoo(initialValue, changedValueA)
    return {value, buttonClick}
  }

  const screen1 = render(component)
  screen1.buttonClick()
  const screen2 = render(component)
  screen2.buttonClick()
  expect(screen2.value).toBe(changedValueA)
})
```

## useEffect

一気に実装する。

```typescript
describe('useEffect', () => {

  it('Gets executed.', () => {
    const proc = vi.fn()
    const component = () => {
      useEffect(() => {
        proc()
      }, [])
    }

    const screen1 = render(component)
    expect(proc).toHaveBeenCalledTimes(1)
  })

  it('Not executed when the dep is unchanged.', () => {
    const proc = vi.fn()
    const component = () => {
      useEffect(() => {
        proc()
      }, [])
    }

    const screen1 = render(component)
    expect(proc).toHaveBeenCalledTimes(1)
    const screen2 = render(component)
    expect(proc).toHaveBeenCalledTimes(1)
  })

  it('Gets executed when a dep is changed.', () => {
    const initialValue = 123;
    const changedValue = 456;
    const proc = vi.fn()
    const component = () => {
      const [value, setValue] = useState(initialValue)
      useEffect(() => {
        proc()
      }, [value])
      const buttonClick = () => {
        setValue(changedValue)
      }
      return {value, buttonClick}
    }

    const screen1 = render(component)
    expect(proc).toHaveBeenCalledTimes(1)
    screen1.buttonClick()
    const screen2 = render(component)
    expect(proc).toHaveBeenCalledTimes(2)
  })
  
})
```

## おまけ

`Object.defineProperty` を使って、コンポーネントの識別を高速化してみよう。

