type State<T> = {
    currentValue?: T
}
type Effect = {
    oldValues: any
}

type Context = {
    currentState: number,
    states: State<any>[],
    currentEffect: number,
    effects: Effect[]
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
            states: [],
            currentEffect: 0,
            effects: [],
        }
    }
    globalContext.currentContext = globalContext.contexts[key]
    globalContext.currentContext.currentState = 0
    globalContext.currentContext.currentEffect = 0
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

const arrayEquals = (a: any, b: any) => {
    if (typeof a !== 'object') return false
    if (typeof b !== 'object') return false
    if (a.length !== b.length) return false
    return a.every((value:any, index:number) => value === b[index])
}

export const useEffect = (proc: () => void, deps: any[]) => {
    const context = globalContext.currentContext!
    if (context.effects.length <= context.currentEffect) {
        context.effects.push({ oldValues: undefined })
    }
    const effect = context.effects[context.currentEffect]
    context.currentEffect++
    if (!arrayEquals(effect.oldValues, deps)) {
        effect.oldValues = deps
        proc()
    }
}