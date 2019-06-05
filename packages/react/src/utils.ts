import { reduce, isFn } from '@uform/utils'

export * from '@uform/utils'

export const isNum = (value: string | number): boolean => typeof value === 'number'

export const compose = (payload, args: [], revert: boolean) =>
  reduce(
    args,
    (buf, fn: any) => {
      return isFn(fn) ? fn(buf) : buf
    },
    payload,
    revert
  )

export const createHOC = wrapper => options => Target => {
  return wrapper({ ...options }, Target)
}

export const filterSchema = (_, key): boolean => ['items', 'properties'].indexOf(key) < 0

export const filterSchemaPropertiesAndReactChildren = (_, key): boolean => {
  return ['items', 'properties', 'children'].indexOf(key) < 0
}