import React from 'react'
import {Client as ImboClient} from 'imboclient'
import ImageControlsContainer from './ImageControlsContainer'

const thumbOpts = {
  width: 200,
  height: 200
}

class DemoWizard extends React.Component {
  constructor() {
    super()

    const config = JSON.parse(localStorage.imboConfig || '{}')
    this.state = {
      config,
      client: config.user && new ImboClient(config),
      imageIdentifier: localStorage.imboImageIdentifier
    }

    this.handleUploadImage = this.handleUploadImage.bind(this)
    this.handleShowImagePicker = this.handleShowImagePicker.bind(this)
    this.handleSetCredentials = this.handleSetCredentials.bind(this)
    this.handleSelectImage = this.handleSelectImage.bind(this)
  }

  /* eslint-disable no-alert */
  handleSetCredentials() {
    const currentHost = this.state.config.hosts && this.state.config.hosts.join(',')
    const host = prompt('Hostname?', currentHost || 'http://imbo')
    const hosts = (host || '').split(',').map(it => it.trim()).filter(Boolean)

    // If the user cancelled...
    if (!host || !hosts.length) {
      return
    }

    const config = {
      hosts: hosts,
      user: prompt('User?', this.state.config.user || 'espen'),
      publicKey: prompt('Public key?', this.state.config.publicKey || 'espen'),
      privateKey: prompt('Private key?', this.state.config.privateKey || 'omgwtfbbq')
    }

    this.setState({
      config,
      client: new ImboClient(config)
    })

    localStorage.setItem('imboConfig', JSON.stringify(config))
  }
  /* eslint-enable no-alert */

  handleUploadImage(event) {
    const file = event.target.files.length > 0 && event.target.files[0]
    if (!file) {
      return
    }

    this.setState({file: file})

    this.state.client.addImage(file, {
      onComplete: (err, imageIdentifier, body) => {
        if (err) {
          return console.error('An error occured', err)
        }

        console.log(`Image added! Image identifier: ${imageIdentifier}`)
        console.log(`Size of image: ${body.width}x${body.height}`)

        this.setImageIdentifier(imageIdentifier)
      },
      onProgress: prog => {
        if (!prog.lengthComputable) {
          return
        }

        this.setState({progress: ((prog.loaded / prog.total) * 100)})
      }
    })
  }

  handleShowImagePicker() {
    this.state.client.getImages((err, res) => {
      if (err) {
        throw err
      }

      this.setState({images: res})
    })
  }

  handleSelectImage(event) {
    event.preventDefault()
    const imageId = event.currentTarget.getAttribute('href').replace(/^#/, '')
    this.setImageIdentifier(imageId)
  }

  setImageIdentifier(imageId) {
    localStorage.setItem('imboImageIdentifier', imageId)

    this.setState({
      progress: 100,
      images: null,
      imageIdentifier: imageId
    })
  }

  renderImagePicker() {
    return (
      <ul className="image-picker">
        {this.state.images.map(img =>
          <li key={img.imageIdentifier}>
            <a href={`#${img.imageIdentifier}`} onClick={this.handleSelectImage}>
              <img
                src={this.state.client.getImageUrl(img.imageIdentifier).thumbnail(thumbOpts)}
                {...thumbOpts}
              />
            </a>
          </li>
        )}
      </ul>
    )
  }

  renderImageControls() {
    return this.state.imageIdentifier &&
      <ImageControlsContainer
        client={this.state.client}
        imageIdentifier={this.state.imageIdentifier}
      />
  }

  render() {
    return (
      <div className="wizard">
        <ul className="nav">
          <li>
            <button onClick={this.handleSetCredentials}>Set config</button>
          </li>

          {this.state.config.user &&
            <li>
              <button onClick={this.handleShowImagePicker}>Select image</button>
            </li>
          }

          {this.state.config.user &&
            <li>
              <input
                type="file"
                name="image"
                accept="image/x-png, image/gif, image/jpeg, image/png"
                onChange={this.handleUploadImage}
              />
            </li>
          }
        </ul>

        {this.state.progress && this.state.progress < 100 &&
          <progress max="100" value={this.state.progress} />
        }

        {this.state.images ? this.renderImagePicker() : this.renderImageControls()}
      </div>
    )
  }
}

export default DemoWizard
