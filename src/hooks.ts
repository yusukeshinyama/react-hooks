export const useState = <T> (initialValue: T): [()=>T, (_: T)=>void] => {
    let value: T = initialValue
    return [
        (): T => value,
        (changedValue: T) => {
            value = changedValue
        }
    ]
}
