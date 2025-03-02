export type State<T> = {
    currentValue?: T
}

export type Context = {
    currentState: number,
    states: State<any>[]
}

export const render = (context: Context, component: (context: Context) => any) => {
    context.currentState = 0
    if (context.states === undefined) {
        context.states = []
    }
    return component(context)
}

export const useState = <T>(context: Context, initialValue: T): [T, (_: T)=>void] => {
    if (context.states.length <= context.currentState) {
        context.states.push({currentValue: initialValue})
    }
    const state = context.states[context.currentState]
    context.currentState++
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
