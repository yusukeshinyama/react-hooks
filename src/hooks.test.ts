import {vi, describe, it, expect, afterAll, vitest, afterEach} from "vitest";
import {useState, render} from "./hooks";

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

});
