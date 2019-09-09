import React, { Component } from 'react'
import Script from 'react-load-script'
let viewer3D
let app
let viewToken = 'ba3fa05cf61e44778c2f359f51992563'
class MainModel extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleScriptCreate() {
    this.setState({ scriptLoaded: false })
  }

  handleScriptError() {
    this.setState({ scriptError: true })
  }

  successCallback = viewMetaData => {
    //获取DOM元素
    let domShow = document.getElementById('domId')
    //创建WebApplication3DConfig
    let webAppConfig = new window.Glodon.Bimface.Application.WebApplication3DConfig()
    //设置创建WebApplication3DConfig的dom元素值
    webAppConfig.domElement = domShow
    //创建WebApplication3D
    app = new window.Glodon.Bimface.Application.WebApplication3D(webAppConfig)
    //添加待显示的模型
    app.addView(viewToken)
    //获取viewer3D对象
    viewer3D = app.getViewer()
    console.log(viewer3D)
  }
  failureCallback = () => {
    alert('失败')
  }

  handleScriptLoad() {
    this.setState({ scriptLoaded: true })
    // 设置BIMFACE JSSDK加载器的配置信息
    let loaderConfig = new window.BimfaceSDKLoaderConfig()
    loaderConfig.viewToken = viewToken
    // 加载BIMFACE JSSDK加载器
    window.BimfaceSDKLoader.load(
      loaderConfig,
      this.successCallback.bind(this),
      this.failureCallback.bind(this)
    )
  }
  render() {
    return (
      <div className="App">
        <Script
          url="https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js"
          onCreate={this.handleScriptCreate.bind(this)}
          onError={this.handleScriptError.bind(this)}
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <div id="domId"></div>
      </div>
    )
  }
}

export default MainModel
