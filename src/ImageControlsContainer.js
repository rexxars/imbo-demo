import React from 'react'
import ImageControls from './ImageControls'

class ImageControlsContainer extends React.Component {
  constructor() {
    super()

    this.state = {}
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  getMaxSize() {
    const node = this.refs.node
    const padding = 16

    return {
      maxWidth: node.clientWidth - 2 - (padding * 2),
      maxHeight: window.innerHeight - node.getBoundingClientRect().top - (padding * 4)
    }
  }

  handleResize() {
    this.setState(this.getMaxSize())
  }

  render() {
    if (!this.state.maxWidth) {
      return <div ref="node" className="image-controls" />
    }

    return (
      <div ref="node" className="image-controls">
        <ImageControls
          maxWidth={this.state.maxWidth}
          maxHeight={this.state.maxHeight}
          {...this.props}
        />
      </div>
    )
  }
}

export default ImageControlsContainer
