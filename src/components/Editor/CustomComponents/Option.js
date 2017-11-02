/* @flow */

import React, { Component } from 'react';
import classNames from 'classnames';

type Props = {
  onClick: Function,
  children: any,
  value: string,
  className: string,
  activeClassName?: string,
  active?: boolean,
  disabled?: bool,
  title: string
}

export default class Option extends Component<Props> {
  onClick: Function = () => {
    const { disabled, onClick, value } = this.props;
    if (!disabled) {
      onClick(value);
    }
  };

  render() {
    const { children, className, activeClassName, active, disabled, title } = this.props;
    return (
      <div
        className={classNames(
          'rdw-option-wrapper',
          className,
          {
            [`rdw-option-active ${activeClassName ? activeClassName : ''}`]: active,
            'rdw-option-disabled': disabled,
          }
        )}
        onClick={this.onClick}
        aria-selected={active}
        title={title}
      >
        {children}
      </div>
    );
  }
}
