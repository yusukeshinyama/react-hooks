import { vi, describe, it, expect, afterAll, vitest, afterEach } from "vitest";
import {State, useState} from "./hooks";

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
            return { value, buttonClick }
        }

        const state = {} as State<number>
        const render1 = component(state)
        expect(render1.value).toBe(initialValue)
        render1.buttonClick()
        const render2 = component(state)
        expect(render2.value).toBe(changedValue)
    })

});
