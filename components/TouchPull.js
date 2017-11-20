/**
 * 主要代码
 * @time 2017-11-20
 * @author wpzheng
 */

import { Component } from 'react'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  // 拖拽的缓动公式
  easing(distance) {
    let t = distance
    let b = 0;
    // 允许拖拽的最大距离
    let d = screen.availHeight
    // 提示标签最大的有效拖拽距离
    let c = d / 2.5
    return c*Math.sin(t/d*(Math.PI/2)) + b
  }
  touchStart = (e) => {
    console.log('touchStart')
    if(e.touches.length == 1) this._initialTouch = {
      clientY: e.touches[0].clientY,
      scrollTop: this.refs.pullpanel.scrollTop
    }
  }
  touchMove = (e) => {
    let scrollTop = this.refs.pullpanel.scrollTop
    let distance = e.touches[0].clientY - this._initialTouch.clientY
    if(distance > 0 && scrollTop <= 0) {
      let pullDistance = distance - this._initialTouch.scrollTop
      let pullHeight = this.easing(pullDistance)
      console.log(pullHeight)
    }
  }
  touchEnd = (e) => {
    console.log('touchend')
  }
  render() {
    return(
      <div ref="pullpanel"
        onTouchStart={(e)=>this.touchStart(e)}
        onTouchMove={(e)=>this.touchMove(e)}
        onTouchEnd={(e)=>this.touchEnd(e)}
      >
        <div className="pull-text">
        </div>
        <div className="pull-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}