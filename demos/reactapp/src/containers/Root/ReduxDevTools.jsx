/**
 * @file Redux 开发工具
 * @author Zhang Peng
 * @see https://github.com/gaearon/redux-devtools
 * @see https://github.com/gaearon/redux-devtools-dock-monitor
 * @see https://github.com/gaearon/redux-devtools-log-monitor
 */
import React from 'react'
// Exported from redux-devtools
import { createDevTools } from 'redux-devtools'
// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

/**
 * Redux 开发工具组件
 * @class
 */
// createDevTools takes a monitor and produces a DevTools component
const ReduxDevTools = createDevTools(
  // Monitors are individually adjustable with props.
  // Consult their repositories to learn about those props.
  // Here, we put LogMonitor inside a DockMonitor.
  // Note: DockMonitor is visible by default.
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'
               defaultIsVisible={true}>
    <LogMonitor theme='tomorrow'/>
  </DockMonitor>
)
export default ReduxDevTools
