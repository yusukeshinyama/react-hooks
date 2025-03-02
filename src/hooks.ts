type State<T> = {
    currentValue?: T
}

type Context = {
    currentState: number,
    states: State<any>[]
}

type ContextMap = {
    [key: string]: Context,
}

type GlobalContext = {
    contexts: ContextMap,
    currentContext?: Context
}

let globalContext: GlobalContext = {
    contexts: {}
}

export const render = (component: () => any) => {
    const key = component.toString()
    if (globalContext.contexts[key] === undefined) {
        globalContext.contexts[key] = {
            currentState: 0,
            states: []
        }
    }
    globalContext.currentContext = globalContext.contexts[key]
    globalContext.currentContext.currentState = 0
    return component()
}

export const useState = <T>(initialValue: T): [T, (_: T)=>void] => {
    const context = globalContext.currentContext!
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
