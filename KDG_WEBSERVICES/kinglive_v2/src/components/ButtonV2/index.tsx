/* eslint-disable react-hooks/exhaustive-deps, react/button-has-type */
import React, { forwardRef, memo, useCallback } from 'react'
// import debounce from 'lodash.debounce'

import { ReactComponent as LoadingIcon } from '../../assets/images/loading.svg'
import { PropsButtonBSC, RefButtonBSC } from './index.d'
import './index.less'

const ButtonBSC = memo<PropsButtonBSC>(forwardRef<RefButtonBSC, PropsButtonBSC>((props, ref) => {
  const { ghost, gray, loading, id, className, primary, left, right, disabled, type, link } = props
  const hasSpecTheme = useCallback((): string => {
    const classes: string[] = []
    if (primary) {
      classes.push('btn-bsc-primary')
    }
    if (gray) {
      classes.push('btn-bsc-gray')
    }
    if (ghost) {
      classes.push('btn-bsc-ghost')
    } 
    if (loading) {
      classes.push('btn-bsc-loading')
    }
    if (disabled) {
      classes.push('btn-bsc-disabled')
    }
    if (link) {
      classes.push('btn-bsc-link')
    }
    // if (hide) {
    //   classes.push('btn-bsc-hide')
    // }
    
    return classes.join(' ')
  }, [ghost, gray, loading, primary, disabled, type, link])
// }, [ghost, gray, loading, primary, disabled, hide])
  const handleClick = useCallback((e: any) => {
    return props.click&&props.click(e)
  }, [props.click])

  return (
    <div
      {...(id ? { id }:{})}
      className={`
        btn-bsc
        btn-bsc-common
        ${hasSpecTheme()} 
        ${className || ''}
      `}
    >
      <button
        onClick={handleClick}
        type={type || 'button'}
        disabled={props.disabled}
      >
        <div>
          {left&&left}
          {props.text&&(<span>{props.text}</span>)}
          {props.loading && (<LoadingIcon className='btn-bsc-icon-loading' />)}
          {/* {props.href&&(<a href={props.href}>{props.text}</a>)} */}
          {right&&right}
        </div>
      </button>
    </div>
  )
}))

export * from './index.d'

export default ButtonBSC