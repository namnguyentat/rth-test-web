/* @flow */

import React, { Component } from 'react';
import classNames from 'classnames';
import Option from './Option';

type Props = {
  expanded: boolean,
  onExpandEvent: Function,
  doCollpase: Function,
  onChange: Function,
  doCollapse: Function,
  config: Object,
  translations: Object
}

type State = {
  embeddedLink: string,
  height: number,
  width: number
}

class LayoutComponent extends Component<Props, State> {

  state: Object = {
    embeddedLink: '',
    height: this.props.config.defaultSize.height,
    width: this.props.config.defaultSize.width,
  };

  componentWillReceiveProps(props: Object) {
    if (this.props.expanded && !props.expanded) {
      const { height, width } = this.props.config.defaultSize;
      this.setState({
        embeddedLink: '',
        height: height,
        width: width,
      });
    }
  }

  updateValue: Function = (event: Object): void => {
    this.setState({
      [`${event.target.name}`]: event.target.value,
    });
  };

  onChange: Function = (event: Object): void => {
    const { onChange } = this.props;
    let fixEmbeddedLink
    const { embeddedLink, height, width } = this.state;
    if (embeddedLink.indexOf("youtube") >= 0){
      fixEmbeddedLink = embeddedLink.replace("watch?v=","embed/").replace("/watch/", "/embed/")
      fixEmbeddedLink = fixEmbeddedLink.replace("/watch/", "/embed/");
      fixEmbeddedLink = fixEmbeddedLink.replace("youtu.be/","youtube.com/embed/");
    } else {
      fixEmbeddedLink = embeddedLink
    }
    onChange(fixEmbeddedLink, height, width);
  };

  rendeEmbeddedLinkModal(): Object {
    const { embeddedLink, height, width } = this.state;
    const { config: { popupClassName }, doCollapse, translations } = this.props;
    return (
      <div
        className={classNames('rdw-embedded-modal', popupClassName)}
        onClick={e => e.stopPropagation()}
      >
        <div className="rdw-embedded-modal-header">
          <span className="rdw-embedded-modal-header-option">
            {translations['components.controls.embedded.embeddedlink']}
            <span className="rdw-embedded-modal-header-label" />
          </span>
        </div>
        <div className="rdw-embedded-modal-link-section">
          <input
            className="rdw-embedded-modal-link-input"
            placeholder={translations['components.controls.embedded.enterlink']}
            onChange={this.updateValue}
            onBlur={this.updateValue}
            value={embeddedLink}
            name="embeddedLink"
          />
          <div className="rdw-embedded-modal-size">
            <input
              onChange={this.updateValue}
              onBlur={this.updateValue}
              value={height}
              name="height"
              className="rdw-embedded-modal-size-input"
              placeholder="Height"
            />
            <input
              onChange={this.updateValue}
              onBlur={this.updateValue}
              value={width}
              name="width"
              className="rdw-embedded-modal-size-input"
              placeholder="Width"
            />
          </div>
        </div>
        <span className="rdw-embedded-modal-btn-section">
          <button
            className="rdw-embedded-modal-btn"
            onClick={this.onChange}
            disabled={!embeddedLink || !height || !width}
          >
            {translations['generic.add']}
          </button>
          <button
            className="rdw-embedded-modal-btn"
            onClick={doCollapse}
          >
            {translations['generic.cancel']}
          </button>
        </span>
      </div>
    );
  }

  render(): Object {
    const { config: { icon, className, title }, expanded, onExpandEvent } = this.props;
    return (
      <div
        className="rdw-embedded-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-embedded-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title}
        >
          <img
            src={icon}
            alt=""
          />
        </Option>
        {expanded ? this.rendeEmbeddedLinkModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent
