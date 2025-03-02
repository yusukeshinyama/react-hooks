import { vi, describe, it, expect, afterAll, vitest, afterEach } from "vitest";
import { useState } from "./hooks";

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

});
