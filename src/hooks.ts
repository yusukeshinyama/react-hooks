export type State<T> = {
    currentValue?: T
}

export type Context = {
    currentState: number,
    states: State<any>[]
}

let context: Context = {
    currentState: 0,
    states: []
}

export const render = (component: (context: Context) => any) => {
    context.currentState = 0
    if (context.states === undefined) {
        context.states = []
    }
    return component(context)
}

export const useState = <T>(initialValue: T): [T, (_: T)=>void] => {
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
