// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import Spinner from './Spinner'

type Props = {
  expanded: boolean,
  onExpandEvent: Function,
  doCollapse: Function,
  onChange: Function,
  config: Object,
  translations: Object
}

type State = {
  imgSrc: string,
  dragEnter: boolean,
  uploadHighlighted: Function,
  showImageLoading: boolean,
  height: number,
  width: number
}


class ImageButton extends Component<Props, State> {
  state: Object = {
    imgSrc: '',
    dragEnter: false,
    uploadHighlighted: this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
    showImageLoading: false,
    height: this.props.config.defaultSize.height,
    width: this.props.config.defaultSize.width,
  };

  componentWillReceiveProps(props: Object): void {
    if (this.props.expanded && !props.expanded) {
      this.setState({
        imgSrc: '',
        dragEnter: false,
        uploadHighlighted: this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
        showImageLoading: false,
        height: this.props.config.defaultSize.height,
        width: this.props.config.defaultSize.width,
      })
    } else if (props.config.uploadCallback !== this.props.config.uploadCallback ||
      props.config.uploadEnabled !== this.props.config.uploadEnabled) {
      this.setState({
        uploadHighlighted: props.config.uploadEnabled && !!props.config.uploadCallback,
      });
    }
  }

  toggleShowImageLoading: Function = (): void => {
    const showImageLoading = !this.state.showImageLoading;
    this.setState({
      showImageLoading,
    });
  };

  addImageFromSrcLink: Function = (imgSrc: string): void => {
    const { height, width } = this.state;
    const { onChange } = this.props;
    onChange(imgSrc, height, width);
  };

  selectImage: Function = (event: Object): void => {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadImage(event.target.files[0]);
    }
  };

  uploadImage: Function = (file: Object): void => {
    this.toggleShowImageLoading();
    const { uploadCallback } = this.props.config;
    uploadCallback(file)
      .then(({ data }) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
        });
        this.addImageFromSrcLink(data.link);
      }).catch(() => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
        });
      });
  };

  render(): Object {
    const { config: { icon }, onExpandEvent } = this.props;
    const { showImageLoading } = this.state

    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-label="rdw-image-control"
      >
        <label onClick={onExpandEvent} className="rdw-option-wrapper">
          <img
            src={icon}
            alt=""
          />
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={this.selectImage}
            className="rdw-image-modal-upload-option-input"
          />
        </label>
        {showImageLoading && <Spinner/>}
      </div>
    );
  }
}

export default ImageButton;
