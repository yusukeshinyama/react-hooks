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

type Function = {
    _id: number
}

let _id = 0

export const render = (component: () => any) => {
    let id = (component as unknown as Function)._id
    if (id === undefined) {
        id = _id++
        Object.defineProperty(component, '_id', { value: id })
    }
    if (globalContext.contexts[id] === undefined) {
        globalContext.contexts[id] = {
            currentState: 0,
            states: [],
            currentEffect: 0,
            effects: [],
        }
    }
    globalContext.currentContext = globalContext.contexts[id]
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