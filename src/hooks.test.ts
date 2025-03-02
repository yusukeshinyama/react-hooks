import {vi, describe, it, expect, afterAll, vitest, afterEach} from "vitest";
import {Context, useState, render} from "./hooks";

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
            return { value, buttonClick }
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
            return { valueA, valueB, buttonClickA, buttonClickB }
        }

        const context = {} as Context
        const screen1 = render(context, component)
        screen1.buttonClickA()
        screen1.buttonClickB()
        const screen2 = render(context, component)
        expect(screen2.valueA).toBe(changedValueA)
        expect(screen2.valueB).toBe(changedValueB)
    })

});
