import React from 'react'
import { isFn, getIn, camelCase, isEqual } from '../utils'
import { FieldProps } from '../type'

export interface CircleButtonProps {
  onClick: React.MouseEvent
  hasText: boolean
}

export interface ArrayFieldOptions {
  TextButton: React.ComponentType
  CircleButton: React.ComponentType<CircleButtonProps>
  AddIcon: React.ComponentType
  RemoveIcon: React.ComponentType
  MoveDownIcon: React.ComponentType
  MoveUpIcon: React.ComponentType
}

export const createArrayField = (options: ArrayFieldOptions) => {
  const { TextButton, CircleButton, AddIcon, RemoveIcon, MoveDownIcon, MoveUpIcon } = {
    TextButton: () => <div>You Should Pass The TextButton.</div>,
    CircleButton: () => <div>You Should Pass The CircleButton.</div>,
    AddIcon: () => <div>You Should Pass The AddIcon.</div>,
    RemoveIcon: () => <div>You Should Pass The RemoveIcon.</div>,
    MoveDownIcon: () => <div>You Should Pass The MoveDownIcon.</div>,
    MoveUpIcon: () => <div>You Should Pass The MoveUpIcon.</div>,
    ...options
  }

  return class ArrayField extends React.Component<FieldProps> {
    isActive = (key: string, value: any): boolean => {
      const readOnly: boolean | ((key: string, value: any) => boolean) = this.getProps('readOnly')
      const disabled = this.getDisabled()
      if (isFn(disabled)) {
        return disabled(key, value)
      } else if (isFn(readOnly)) {
        return readOnly(key, value)
      } else {
        return !readOnly && !disabled
      }
    }

    getApi(index: number) {
      const { value } = this.props
      return {
        index,
        isActive: this.isActive,
        dataSource: value,
        record: value[index],
        add: this.onAddHandler(),
        remove: this.onRemoveHandler(index),
        moveDown: e => {
          return this.onMoveHandler(index, index + 1 > value.length - 1 ? 0 : index + 1)(e)
        },
        moveUp: e => {
          return this.onMoveHandler(index, index - 1 < 0 ? value.length - 1 : index - 1)(e)
        }
      }
    }

    getProps(path: string) {
      return getIn(this.props.schema, `x-props${path ? '.' + path : ''}`)
    }

    renderWith(name: string, index, defaultRender?) {
      const render = this.getProps(camelCase(`render-${name}`))
      if (isFn(index)) {
        defaultRender = index
        index = 0
      }
      if (isFn(render)) {
        return render(this.getApi(index))
      } else if (defaultRender) {
        return isFn(defaultRender) ? defaultRender(this.getApi(index), render) : defaultRender
      }
    }

    renderAddition() {
      const { locale } = this.props
      const { value } = this.props
      return (
        this.isActive('addition', value) &&
        this.renderWith(
          'addition',
          (
            { add }: { add?: (event: React.MouseEvent<HTMLDivElement>) => void } = {},
            text: string
          ) => {
            return (
              <div className='array-item-addition' onClick={add}>
                <TextButton>
                  <AddIcon />
                  {text || locale.addItem || '添加'}
                </TextButton>
              </div>
            )
          }
        )
      )
    }

    renderEmpty() {
      const { locale, value } = this.props
      return (
        value.length === 0 &&
        this.renderWith('empty', ({ add, isActive }, text) => {
          const active = isActive('empty', value)
          return (
            <div
              className={`array-empty-wrapper ${!active ? 'disabled' : ''}`}
              onClick={active ? add : undefined}
            >
              <div className='array-empty'>
                <img
                  style={{ backgroundColor: 'transparent' }}
                  src='//img.alicdn.com/tfs/TB1cVncKAzoK1RjSZFlXXai4VXa-184-152.svg'
                />
                {active && (
                  <TextButton>
                    <AddIcon />
                    {text || locale.addItem || '添加'}
                  </TextButton>
                )}
              </div>
            </div>
          )
        })
      )
    }

    renderRemove(index: number, item: any) {
      return (
        this.isActive(`${index}.remove`, item) &&
        this.renderWith('remove', index, ({ remove }, text) => {
          return (
            <CircleButton onClick={remove} hasText={!!text}>
              <RemoveIcon />
              {text && <span className='op-name'>{text}</span>}
            </CircleButton>
          )
        })
      )
    }

    renderMoveDown(index: number, item: any) {
      const { value } = this.props
      return (
        value.length > 1 &&
        this.isActive(`${index}.moveDown`, item) &&
        this.renderWith('moveDown', index, ({ moveDown }, text) => {
          return (
            <CircleButton onClick={moveDown} hasText={!!text}>
              <MoveDownIcon />
              <span className='op-name'>{text}</span>
            </CircleButton>
          )
        })
      )
    }

    renderMoveUp(index: number) {
      const { value } = this.props
      return (
        value.length > 1 &&
        this.isActive(`${index}.moveUp`, value) &&
        this.renderWith('moveUp', index, ({ moveUp }, text) => {
          return (
            <CircleButton onClick={moveUp} hasText={!!text}>
              <MoveUpIcon />
              <span className='op-name'>{text}</span>
            </CircleButton>
          )
        })
      )
    }

    renderExtraOperations(index: number) {
      return this.renderWith('extraOperations', index)
    }

    getDisabled(): boolean | ((key: string, value: any) => boolean) {
      const { editable, name } = this.props
      const disabled = this.getProps('disabled')
      if (editable !== undefined) {
        if (isFn(editable)) {
          if (!editable(name)) {
            return true
          }
        } else if (editable === false) {
          return true
        }
      }
      return disabled
    }

    onRemoveHandler(index: number): Function {
      const { value, mutators, schema, locale } = this.props
      const { minItems } = schema
      return e => {
        e.stopPropagation()
        if (minItems >= 0 && value.length - 1 < minItems) {
          mutators.errors(locale.array_invalid_minItems, minItems)
        } else {
          mutators.remove(index)
        }
      }
    }

    onMoveHandler(_from: number, to: number): Function {
      const { mutators } = this.props
      return e => {
        e.stopPropagation()
        mutators.move(_from, to)
      }
    }

    onAddHandler() {
      const { value, mutators, schema, locale } = this.props
      const { maxItems } = schema
      return e => {
        e.stopPropagation()
        if (maxItems >= 0 && value.length + 1 > maxItems) {
          mutators.errors(locale.array_invalid_maxItems, maxItems)
        } else {
          mutators.push()
        }
      }
    }

    onClearErrorHandler() {
      return () => {
        const { value, mutators, schema } = this.props
        const { maxItems, minItems } = schema
        if (
          (maxItems >= 0 && value.length <= maxItems) ||
          (minItems >= 0 && value.length >= minItems)
        ) {
          mutators.errors()
        }
      }
    }

    validate() {
      const { value, mutators, schema, locale } = this.props
      const { maxItems, minItems } = schema
      if (value.length > maxItems) {
        mutators.errors(locale.array_invalid_maxItems, maxItems)
      } else if (value.length < minItems) {
        mutators.errors(locale.array_invalid_minItems, minItems)
      } else {
        mutators.errors()
      }
    }

    componentDidUpdate(prevProps) {
      if (!isEqual(prevProps.value, this.props.value)) {
        this.validate()
      }
    }

    componentDidMount() {
      this.validate()
    }
  }
}
