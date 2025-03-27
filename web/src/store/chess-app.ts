import { persistentAtom } from '@nanostores/persistent'

export const $mainlines = persistentAtom<string[]>('chess-mainlines:', [], {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})

export const setMainlines = (value: string[]) => {
  $mainlines.set(value)
}
