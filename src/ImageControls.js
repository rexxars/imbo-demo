/* eslint-disable no-unused-expressions, no-alert, no-bitwise */
import React from 'react'

const isNotNan = num => !isNaN(num)
const sizeTransformations = ['resize', 'maxSize', 'thumbnail', 'smartSize']
const hasSizeTransformation = url => url.transformations.some(
  transform => sizeTransformations.indexOf(transform.split(':')[0]) !== -1
)

class ImageControls extends React.Component {
  constructor({client, imageIdentifier}) {
    super()

    this.state = {
      url: client.getImageUrl(imageIdentifier),
      client,
      imageIdentifier
    }

    this.handle = [
      'Rotate',
      'Border',
      'Contrast',
      'Crop',
      'Desaturate',
      'Flip',
      'Flop',
      'Modulate',
      'Sepia',
      'Sharpen',
      'Thumbnail',
      'Reset'
    ].reduce((target, transformation) => {
      target[transformation.toLowerCase()] = () => {
        this[`handle${transformation}`]()
        this.forceUpdate()
      }
      return target
    }, {})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      client: nextProps.client,
      imageIdentifier: nextProps.imageIdentifier,
      url: nextProps.client.getImageUrl(nextProps.imageIdentifier)
    })
  }

  handleRotate() {
    const degrees = Number(prompt('Degrees?', 90))
    !isNaN(degrees) && this.state.url.rotate({angle: degrees})
  }

  handleBorder() {
    const size = Number(prompt('Size?', 15))
    !isNaN(size) && this.state.url.border({width: size, height: size, color: '#bf1942'})
  }

  handleContrast() {
    this.state.url.sharpen(prompt('Amount?', 5) | 0)
  }

  handleCrop() {
    let val = prompt('Width, height, x, y?', '320,240,50,50') || ''
    val = val.split(',').map(param => param.trim()).map(Number).filter(isNotNan)
    if (val.length < 4) {
      return
    }

    this.state.url.crop({width: val[0], height: val[1], x: val[2], y: val[3]})
  }

  handleDesaturate() {
    this.state.url.desaturate()
  }

  handleFlip() {
    this.state.url.flipHorizontally()
  }

  handleFlop() {
    this.state.url.flipVertically()
  }

  handleModulate() {
    let val = prompt('Brightness, saturation, hue?', '50,88,33') || ''
    val = val.split(',').map(param => param.trim()).map(Number).filter(isNotNan)
    if (val.length < 3) {
      return
    }

    this.state.url.modulate({brightness: val[0], saturation: val[1], hue: val[2]})
  }

  handleSepia() {
    this.state.url.sepia()
  }

  handleSharpen() {
    const valid = ['light', 'moderate', 'strong']
    const preset = (prompt('Light, moderate or strong?', valid[1]) || '').trim().toLowerCase()
    if (valid.indexOf(preset) === -1) {
      return
    }

    this.state.url.sharpen({preset})
  }

  handleThumbnail() {
    let val = prompt('Width,Height?', '640,480') || ''
    val = val.split(',').map(param => param.trim()).map(Number).filter(isNotNan)
    if (val.length < 2) {
      return
    }

    this.state.url.thumbnail({width: val[0], height: val[1]})
  }

  handleReset() {
    this.state.url.reset()
  }

  render() {
    const url = this.state.url
    if (!hasSizeTransformation(url)) {
      url.maxSize({width: this.props.maxWidth, height: this.props.maxHeight})
    }

    return (
      <div>
        <img src={url.toString()} />

        <div className="transformations pure-menu custom-restricted-width">
            <span className="pure-menu-heading">Transformations</span>

            <ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" onClick={this.handle.rotate} className="pure-menu-link">Rotate</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.border} className="pure-menu-link">Border</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.contrast} className="pure-menu-link">Contrast</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.crop} className="pure-menu-link">Crop</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.desaturate} className="pure-menu-link">Desaturate</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.flip} className="pure-menu-link">Flip</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.flop} className="pure-menu-link">Flop</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.modulate} className="pure-menu-link">Modulate</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.sepia} className="pure-menu-link">Sepia</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.sharpen} className="pure-menu-link">Sharpen</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.thumbnail} className="pure-menu-link">Thumbnail</a></li>
                <li className="pure-menu-item"><a href="#" onClick={this.handle.reset} className="pure-menu-link">Reset</a></li>
            </ul>
        </div>
      </div>
    )
  }
}

export default ImageControls
