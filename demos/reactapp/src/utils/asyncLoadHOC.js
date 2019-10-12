/**
 * @file 提供异步加载组件功能的高阶组件方法
 * @author Zhang Peng
 * @see https://segmentfault.com/a/1190000009820646
 */

import React from 'react'

let Component = null
export const asyncLoadHOC = loadComponent => (

  class AsyncComponent extends React.Component {

    static hasLoadedComponent() {
      return Component !== null
    }

    componentWillMount() {
      if (AsyncComponent.hasLoadedComponent()) {
        return
      }

      loadComponent().then(
        module => module.default
      ).then((comp) => {
        Component = comp
      }).catch((err) => {
        console.error(`Cannot load component in <AsyncComponent />`)
        throw err
      })
    }

    render() {
      return (Component) ?
    <
      Component
      {...
        this.props
      }
      /> : null;
    }
  }
)
