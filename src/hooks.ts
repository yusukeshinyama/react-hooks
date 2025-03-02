export type State<T> = {
    currentValue?: T
}

export const useState = <T>(state: State<T>, initialValue: T): [T, (_: T)=>void] => {
    if (state.currentValue === undefined) {
        state.currentValue = initialValue
    }
    return [
        state.currentValue,
        (changedValue: T) => {
            state.currentValue = changedValue
        }
    ]
}
