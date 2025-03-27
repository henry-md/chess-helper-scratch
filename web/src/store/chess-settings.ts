import { persistentAtom } from '@nanostores/persistent'


export const $isPlayingWhite = persistentAtom<boolean>('chess-playing-white:', true, {
  encode: (value) => value.toString(),
  decode: (value) => value === 'true'
})

export const $isSkipping = persistentAtom<boolean>('chess-skip-to-branch:', false, {
  encode: (value) => value.toString(),
  decode: (value) => value === 'true'
})

export const $currentPgn = persistentAtom<string>('chess-current-pgn:', '') 

export const setIsPlayingWhite = (value: boolean) => {
  $isPlayingWhite.set(value)
}

export const setIsSkipping = (value: boolean) => {
  $isSkipping.set(value)
}

export const setCurrentPgn = (value: string) => {
  $currentPgn.set(value)
  console.log('currentPgn', value)
}
