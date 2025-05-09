import { persistentAtom } from '@nanostores/persistent'

export const $currentPgnId = persistentAtom<string>('current-pgn-id', '');
export const $numMovesToFirstBranch = persistentAtom<number>('num-moves-to-first-branch', 0, {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
});
export const $currentLine = persistentAtom<string[]>('current-line', [], {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})
export const $currentLineIdx = persistentAtom<number>('current-line-idx', 0, {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})

export const setNumMovesToFirstBranch = (value: number) => {
  $numMovesToFirstBranch.set(value)
}
export const setCurrentPgnId = (value: string) => {
  $currentPgnId.set(value);
}
export const setCurrentLine = (value: string[]) => {
  $currentLine.set(value);
}
export const addToCurrentLine = (value: string) => {
  $currentLine.set([...$currentLine.get(), value]);
}
export const setCurrentLineIdx = (value: number) => {
  $currentLineIdx.set(value);
}


// To be deleted after transition to new game
export const $mainlines = persistentAtom<string[]>('chess-mainlines:', [], {
  encode: (value) => JSON.stringify(value),
  decode: (value) => JSON.parse(value)
})
export const setMainlines = (value: string[]) => {
  $mainlines.set(value);
}
