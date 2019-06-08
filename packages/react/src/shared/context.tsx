import React from 'react'
import { IBroadcast } from '@uform/utils'

export const MarkupContext = React.createContext({})
export const StateContext = React.createContext({})
export const BroadcastContext = React.createContext<Partial<IBroadcast>>({})
