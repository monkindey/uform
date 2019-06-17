import { ISchema } from '@uform/utils'
// import { ColProps } from 'antd/lib/grid/col'

export enum LabelAlign {
  TOP = 'top',
  INSET = 'inset',
  LEFT = 'left'
}

export enum LabelTextAlign {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum Size {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small'
}

export interface IFormConsumerProps {
  // labelCol: ColProps | number
  labelCol: object | number
  wrapperCol: object | number
  autoAddColon: boolean
  size: Size
  inline: boolean
  labelAlign: LabelAlign
  labelTextAlign: LabelTextAlign
}

export interface IFormProps extends IFormConsumerProps {
  className: string
  style: object
  layout: string
  children: React.ReactNode
  component: string
  prefix: string
  onValidateFailed: () => void
}

export interface IFormItemProps extends IFormConsumerProps {
  id: string
  required: boolean
  label: React.ReactNode
  prefix: string
  extra: object

  // TODO
  validateState: any

  isTableColItem: boolean
  help: React.ReactNode
  noMinHeight: boolean
  children: React.ReactElement
  className: string
  style: object
  type: string
  schema: ISchema
}
