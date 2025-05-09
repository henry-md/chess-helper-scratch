import { persistentAtom } from '@nanostores/persistent'

export const $editDialogOpen = persistentAtom<boolean>('edit-dialog-open', false, {
  encode: (value) => value.toString(),
  decode: (value) => value === 'true',
})

export const setEditDialogOpen = (value: boolean) => {
  $editDialogOpen.set(value)
}