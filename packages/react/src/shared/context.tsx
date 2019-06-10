import React from 'react'
import { ISchema } from '@uform/types'
import { IBroadcast } from '@uform/utils'

export const MarkupContext = React.createContext<Partial<ISchema>>({})
export const StateContext = React.createContext({})
export const BroadcastContext = React.createContext<Partial<IBroadcast>>({})
