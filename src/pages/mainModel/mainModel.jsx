import React, { Component } from 'react'
import Script from 'react-load-script'
import './mainModel.scss'
let viewer3D
let app
let viewToken = 'c41c5de908f44293b735e53d3bf7623b'
let modelState
let annotationToolbar = null
class MainModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isIsolationActivated: false,
      isolateText: '构件隔离',
      isZoomToSelectionActivated: false,
      isZoomToSelectionText: '构件定位',
      isOverrideActivated: false,
      isOverrideText: '构件着色',
      isBlinkActivated: false,
      blinkComponentsText: '构件强调',
      isAutoRotateActivated: false,
      btnStartAutoRotateText: '开始旋转场景',
      walkThrough: null,
      annotationState: null,
      isDrawAnnotationActivated: false,
      cunstomItemContainer: null,
      isAddCustomTagActivated: false,
      AddCustomTagText: '开始放置标签'
    }
    this.isolateComponents = this.isolateComponents.bind(this)
    this.zoomToSelectedComponents = this.zoomToSelectedComponents.bind(this)
    this.overrideComponents = this.overrideComponents.bind(this)
    this.blinkComponents = this.blinkComponents.bind(this)
    this.getCurrentState = this.getCurrentState.bind(this)
    this.resetState = this.resetState.bind(this)
    this.startAutoRotate = this.startAutoRotate.bind(this)
    this.createWalkThrough = this.createWalkThrough.bind(this)
    this.addKeyFrame = this.addKeyFrame.bind(this)
    this.playWalkThrough = this.playWalkThrough.bind(this)
    this.createAnnotationToolbar = this.createAnnotationToolbar.bind(this)
    this.onAnnotationSaved = this.onAnnotationSaved.bind(this)
    this.eixtAnnotation = this.eixtAnnotation.bind(this)
    this.drawAnnotation = this.drawAnnotation.bind(this)
    this.restoreAnnotation = this.restoreAnnotation.bind(this)
    this.createCustomItemContainer = this.createCustomItemContainer.bind(this)
    this.addCustomItem = this.addCustomItem.bind(this)
    this.addCustomTag = this.addCustomTag.bind(this)
  }

  // 是否构件隔离
  isolateComponents() {
    if (!this.state.isIsolationActivated) {
      // 设置隔离选项，指定其他构件为半透明状态
      var makeOthersTranslucent =
        window.Glodon.Bimface.Viewer.IsolateOption.MakeOthersTranslucent
      // 调用viewer3D.method，隔离楼层为"F2"的构件
      viewer3D.isolateComponentsByObjectData(
        [{ levelName: 'F1' }],
        makeOthersTranslucent
      )
      // 渲染三维模型
      viewer3D.render()
      // 修改按钮的文字内容
      this.setState({
        isolateText: '取消隔离'
      })
    } else {
      // 清除隔离
      viewer3D.clearIsolation()
      // 渲染三维模型
      viewer3D.render()
      // 修改按钮的文字内容
      this.setState({
        isolateText: '构件隔离'
      })
    }
    this.setState({
      isIsolationActivated: !this.state.isIsolationActivated
    })
  }

  // 定位与返回主视图
  zoomToSelectedComponents() {
    if (!this.state.isZoomToSelectionActivated) {
      // 选中id为"271431"的构件
      viewer3D.addSelectedComponentsById(['2589773'])
      // 定位到选中的构件
      viewer3D.zoomToSelectedComponents()
      // 清除构件选中状态
      viewer3D.clearSelectedComponents()

      this.setState({
        isZoomToSelectionText: '回到主视角'
      })
    } else {
      // 切换至主视角
      viewer3D.setView(window.Glodon.Bimface.Viewer.ViewOption.Home)
      this.setState({
        isZoomToSelectionText: '构件定位'
      })
    }
    this.setState({
      isZoomToSelectionActivated: !this.state.isZoomToSelectionActivated
    })
  }

  //构件着色
  overrideComponents() {
    if (!this.state.isOverrideActivated) {
      // 新建color对象，指定关注构件被染色的数值
      let color = new window.Glodon.Web.Graphics.Color('#11DAB7', 0.5)
      // 对关注构件进行着色
      viewer3D.overrideComponentsColorById(['2589773'], color)
      viewer3D.render()
      this.setState({
        isOverrideText: '清除着色'
      })
    } else {
      // 清除构件着色
      viewer3D.clearOverrideColorComponents()
      viewer3D.render()
      this.setState({
        isOverrideText: '构件着色'
      })
    }
    this.setState({
      isOverrideActivated: !this.state.isOverrideActivated
    })
  }

  // 构件强调
  blinkComponents() {
    if (!this.state.isBlinkActivated) {
      const blinkColor = new window.Glodon.Web.Graphics.Color('#B22222', 0.8)
      // 打开构件强调开关
      viewer3D.enableBlinkComponents(true)
      // 给需要报警的构件添加强调状态
      viewer3D.addBlinkComponentsById(['2589773'])
      // 设置强调状态下的颜色
      viewer3D.setBlinkColor(blinkColor)
      // 设置强调状态下的频率
      viewer3D.setBlinkIntervalTime(500)
      viewer3D.render()
      this.setState({
        blinkComponentsText: '清除强调'
      })
    } else {
      // 清除构件强调
      viewer3D.clearAllBlinkComponents()
      viewer3D.render()
      this.setState({
        blinkComponentsText: '构件强调'
      })
    }
    this.setState({
      isBlinkActivated: !this.state.isBlinkActivated
    })
  }

  // 保存模型状态
  getCurrentState() {
    modelState = viewer3D.getCurrentState()
    window.alert('状态保存成功！')
  }

  // 恢复状态
  resetState() {
    if (modelState != null) {
      // 恢复模型浏览状态
      viewer3D.setState(modelState)
      viewer3D.render()
    } else {
      window.alert('请先保存一个模型浏览状态！')
    }
  }

  // 场景旋转
  startAutoRotate() {
    if (!this.state.isAutoRotateActivated) {
      // 开始场景旋转
      viewer3D.startAutoRotate(5)
      this.setState({
        btnStartAutoRotateText: '结束旋转场景'
      })
    } else {
      // 结束场景旋转
      viewer3D.stopAutoRotate()
      this.setState({
        btnStartAutoRotateText: '开始旋转场景'
      })
    }
    this.setState({
      isAutoRotateActivated: !this.state.isAutoRotateActivated
    })
  }

  // 添加关键帧
  createWalkThrough() {
    if (this.state.walkThrough == null) {
      // 构造路径漫游配置wtConfig
      var walkThroughConfig = new window.Glodon.Bimface.Plugins.Walkthrough.WalkthroughConfig()
      // 设置路径漫游配置匹配的viewer对象
      walkThroughConfig.viewer = viewer3D
      // 构造路径漫游对象
      this.setState(
        {
          walkThrough: new window.Glodon.Bimface.Plugins.Walkthrough.Walkthrough(
            walkThroughConfig
          )
        },
        () => this.state.walkThrough.addKeyFrame()
      )
    }
  }

  // 点击添加关键帧
  addKeyFrame() {
    this.createWalkThrough()
    // console.log(this.state.walkThrough)
    // this.state.walkThrough.addKeyFrame()
  }

  // 播放路径漫游
  playWalkThrough() {
    if (this.state.walkThrough != null) {
      // 设置播放时间为5秒
      this.state.walkThrough.setWalkthroughTime(5)
      // 播放路径漫游
      this.state.walkThrough.play()
    } else {
      window.alert('Please add keyframes first.')
    }
  }

  // ************************** 批注 **************************
  // 创建批注工具条
  createAnnotationToolbar() {
    if (!annotationToolbar) {
      // 创建批注工具条的配置
      let config = new window.Glodon.Bimface.Plugins.Annotation.AnnotationToolbarConfig()
      config.viewer = viewer3D
      // 创建批注工具条
      annotationToolbar = new window.Glodon.Bimface.Plugins.Annotation.AnnotationToolbar(
        config
      )

      // 注册批注工具条的监听事件
      annotationToolbar.addEventListener(
        window.Glodon.Bimface.Plugins.Annotation.AnnotationToolbarEvent.Saved,
        this.onAnnotationSaved
      )
      annotationToolbar.addEventListener(
        window.Glodon.Bimface.Plugins.Annotation.AnnotationToolbarEvent
          .Cancelled,
        this.eixtAnnotation
      )
    }
  }

  // 保存批注
  onAnnotationSaved() {
    this.setState({
      annotationState: annotationToolbar
        .getAnnotationManager()
        .getCurrentState()
    })
    this.eixtAnnotation()
  }

  // 退出批注
  eixtAnnotation() {
    // 显示主工具条
    app.getToolbar('MainToolbar').show()
    annotationToolbar.getAnnotationManager().exit()
    // 批注的激活状态为false
    this.setState({
      isDrawAnnotationActivated: false
    })
  }

  // 开始批注
  drawAnnotation() {
    // 创建批注工具条
    this.createAnnotationToolbar()
    if (!this.state.isDrawAnnotationActivated) {
      // 隐藏主工具条
      app.getToolbar('MainToolbar').hide()
      // 显示批注工具条
      annotationToolbar.show()
      // 修改批注的激活状态为true
      this.setState({
        isDrawAnnotationActivated: true
      })
    }
  }

  // 恢复批注
  restoreAnnotation() {
    console.log(this)
    if (this.state.annotationState != null) {
      annotationToolbar
        .getAnnotationManager()
        .setState(this.state.annotationState)
    } else {
      window.alert('Please draw an annotation first.')
    }
  }

  // 创建标签容器
  createCustomItemContainer() {
    if (!this.state.cunstomItemContainer) {
      // 创建标签容器配置
      let drawableContainerConfig = new window.Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig()
      // 设置容器配置匹配的对象
      drawableContainerConfig.viewer = viewer3D
      // 创建标签容器
      this.setState({
        cunstomItemContainer: new window.Glodon.Bimface.Plugins.Drawable.DrawableContainer(
          drawableContainerConfig
        )
      })
    }
  }

  // 创建标签
  addCustomItem(object) {
    this.createCustomItemContainer()
    // 创建CustomItemConfig
    let config = new window.Glodon.Bimface.Plugins.Drawable.CustomItemConfig()
    let content = document.createElement('div')
    // 自定义样式，支持HTML的任意DOM元素
    // 设置标签的宽度和高度
    content.style.width = '80px'
    content.style.height = '32px'
    // 设置标签样式
    content.style.border = 'solid'
    content.style.borderColor = '#FFFFFF'
    content.style.borderWidth = '2px'
    content.style.borderRadius = '5%'
    content.style.background = '#11DAB7'
    // 设置标签文字内容与样式
    content.innerText = '检查点'
    content.style.color = '#FFFFFF'
    content.style.textAlign = 'center'
    content.style.lineHeight = '32px'
    // 设置自定义标签配置
    config.content = content
    config.viewer = viewer3D
    config.worldPosition = object.worldPosition
    // 创建自定义标签对象
    let customItem = new window.Glodon.Bimface.Plugins.Drawable.CustomItem(
      config
    )
    // 将自定义标签添加至标签容器内
    this.state.cunstomItemContainer.addItem(customItem)
  }

  // 点击添加自定义标签
  addCustomTag() {
    if (!this.state.isAddCustomTagActivated) {
      // 创建鼠标点击的监听事件
      viewer3D.addEventListener(
        window.Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked,
        this.addCustomItem
      )
      this.setState({
        AddCustomTagText: '结束放置标签'
      })
    } else {
      // 移除鼠标点击的监听事件
      viewer3D.removeEventListener(
        window.Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked,
        this.addCustomItem
      )
      this.setState({
        AddCustomTagText: '开始放置标签'
      })
    }
    this.setState({
      isAddCustomTagActivated: !this.state.isAddCustomTagActivated
    })
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
    viewer3D.addEventListener(
      window.Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked,
      function(objectdata) {
        //获取点击构件的相关属性
        console.log(objectdata)
      }
    )
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
    const {
      isolateText,
      isZoomToSelectionText,
      blinkComponentsText,
      btnStartAutoRotateText,
      AddCustomTagText
    } = this.state
    return (
      <div className="BimfaceApp">
        <Script
          url="https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js"
          onCreate={this.handleScriptCreate.bind(this)}
          onError={this.handleScriptError.bind(this)}
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <div className="btnGroup">
          <button
            className="button"
            id="btnIsolation"
            onClick={this.isolateComponents}
          >
            {isolateText}
          </button>
          <button
            className="button"
            id="btnZoomToSelection"
            onClick={this.zoomToSelectedComponents}
          >
            {isZoomToSelectionText}
          </button>
          <button
            className="button"
            id="btnOverrideColor"
            onClick={this.overrideComponents}
          >
            构件着色
          </button>
          <button
            className="button"
            id="btnBlinkComponent"
            onClick={this.blinkComponents}
          >
            {blinkComponentsText}
          </button>
          <button
            className="button"
            id="btnSaveState"
            onClick={this.getCurrentState}
          >
            保存状态
          </button>
          <button
            className="button"
            id="btnRestoreState"
            onClick={this.resetState}
          >
            恢复状态
          </button>
          <button
            className="button"
            id="btnStartAutoRotate"
            onClick={this.startAutoRotate}
          >
            {btnStartAutoRotateText}
          </button>
          <button
            className="button"
            id="btnAddKeyFrame"
            onClick={this.addKeyFrame}
          >
            添加关键帧
          </button>
          <button
            className="button"
            id="btnPlayWalkThrough"
            onClick={this.playWalkThrough}
          >
            播放路径漫游
          </button>
          <button
            className="button"
            id="btnDrawAnnotation"
            onClick={this.drawAnnotation}
          >
            开始绘制批注
          </button>
          <button
            className="button"
            id="btnRestoreAnnotation"
            onClick={this.restoreAnnotation}
          >
            恢复批注
          </button>
          <button
            className="button"
            id="btnTagging"
            onClick={this.addCustomTag}
          >
            {AddCustomTagText}
          </button>
        </div>
        <div id="domId" />
      </div>
    )
  }
}

export default MainModel
