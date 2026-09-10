export type Option<T> = {
  id: string
  value: string
  dataTestId?: string
  icon?: string
  disabled?: boolean
  callback?: () => void
  data?: T
}
