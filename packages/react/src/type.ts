import { IFormOptions, IFormPayload } from '@uform/types'
import { IBroadcast } from '@uform/utils'

export interface SchemaFormProps extends IFormOptions {
  className?: string
  children?: React.ReactNode
}

export interface StateFormProps extends IFormOptions {
  broadcast: IBroadcast

  implementActions: (actions: Object) => Object
  dispatch: (type: string, ...args: any) => void
  subscription: Function

  locale: Object
  onChange?: (payload: IFormPayload) => void
  value?: any
}
