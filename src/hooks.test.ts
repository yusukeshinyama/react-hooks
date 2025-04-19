import {vi, describe, it, expect, afterAll, vitest, afterEach} from "vitest";
import {useState, useEffect, render} from "./hooks";

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
            return { value, buttonClick }
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
            return { valueA, valueB, buttonClickA, buttonClickB }
        }

        const screen1 = render(component)
        screen1.buttonClickA()
        screen1.buttonClickB()
        const screen2 = render(component)
        expect(screen2.valueA).toBe(changedValueA)
        expect(screen2.valueB).toBe(changedValueB)
    })

    it('Multiple components are independent.', () => {
        const initialValue = 123;
        const changedValueA = 456;
        const changedValueB = 789;
        const componentA = () => {
            const [valueA, setValueA] = useState(initialValue)
            const buttonClickA = () => {
                setValueA(changedValueA)
            }
            return { valueA, buttonClickA }
        }
        const componentB = () => {
            const [valueB, setValueB] = useState(initialValue)
            const buttonClickB = () => {
                setValueB(changedValueB)
            }
            const { valueA, buttonClickA } = render(componentA)
            return { valueA, valueB, buttonClickA, buttonClickB }
        }

        const screen1 = render(componentB)
        screen1.buttonClickA()
        screen1.buttonClickB()
        const screen2 = render(componentB)
        expect(screen2.valueA).toBe(changedValueA)
        expect(screen2.valueB).toBe(changedValueB)
    })

    it('Custom hooks work too!', () => {
        const initialValue = 123;
        const changedValueA = 456;
        const useFoo = (initialValue, changedValue) => {
            const [value, setValue] = useState(initialValue)
            const buttonClick = () => {
                setValue(changedValueA)
            }
            return { value, buttonClick }
        }
        const component = () => {
            const { value, buttonClick } = useFoo(initialValue, changedValueA)
            return { value, buttonClick }
        }

        const screen1 = render(component)
        screen1.buttonClick()
        const screen2 = render(component)
        screen2.buttonClick()
        expect(screen2.value).toBe(changedValueA)
    })

});

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
            return { value, buttonClick }
        }

        const screen1 = render(component)
        expect(proc).toHaveBeenCalledTimes(1)
        screen1.buttonClick()
        const screen2 = render(component)
        expect(proc).toHaveBeenCalledTimes(2)
    })
})