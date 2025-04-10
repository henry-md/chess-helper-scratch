import { persistentAtom } from '@nanostores/persistent'

export const $currentPgnId = persistentAtom<string>('current-pgn-id', '');

export const $numMovesToFirstBranch = persistentAtom<number>('num-moves-to-first-branch', 0, {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
});

export const $mainlines = persistentAtom<string[]>('chess-mainlines:', [], {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})

export const setMainlines = (value: string[]) => {
  $mainlines.set(value)
}

export const setNumMovesToFirstBranch = (value: number) => {
  $numMovesToFirstBranch.set(value)
}

export const setCurrentPgnId = (value: string) => {
  $currentPgnId.set(value)
}
