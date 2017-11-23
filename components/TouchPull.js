/**
 * 主要代码
 * @time 2017-11-20
 * @author wpzheng
 */

import { Component } from 'react'
/**
 * 状态制定
 * http://www.haorooms.com/post/webapp_bodyslidebcdiv
 */
const STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  loading: 'loading',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',
  distanceToRefresh: 60 // 下拉多少可以刷新
}

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pullHeight: 0,
      loaderState: ''
    }
  }

  // 判断能否触摸加载数据
  canTouchLoad() {
    return [STATS.refreshing].indexOf(this.state.loaderState) < 0
  }

  // 拖拽的缓动公式
  easing(distance) {
    let t = distance
    let b = 0;
    // 允许拖拽的最大距离
    let d = screen.availHeight
    // 提示标签最大的有效拖拽距离
    let c = d / 2.5
    return c * Math.sin(t / d * (Math.PI / 2)) + b
  }

  touchStart = (e) => {
    if(!this.canTouchLoad()) {
      window.addEventListener('touchmove',(e)=>{
        e.preventDefault()
      })
      return
    }
    if (e.touches.length == 1) this._initialTouch = {
      clientY: e.touches[0].clientY,
      scrollTop: this.refs.pullpanel.scrollTop
    }
  }

  touchMove = (e) => {
    if(!this.canTouchLoad()) {
      window.addEventListener('touchmove',(e)=>{
        e.preventDefault()
      })
      return
    }
    if(!this.canTouchLoad) return
    let scrollTop = this.refs.pullpanel.scrollTop
    let distance = e.touches[0].clientY - this._initialTouch.clientY
    if (distance > 0 && scrollTop <= 0) {
      let pullDistance = distance - this._initialTouch.scrollTop
      let pullHeight = this.easing(pullDistance)
      if (pullDistance < 0) {
        pullDistance = 0
        this._initialTouch.scrollTop = distance
      }
      this.setState({
        loaderState: pullHeight > STATS.distanceToRefresh ? STATS.enough : STATS.pulling,
        pullHeight: pullHeight
      })
    }
  }

  touchEnd = (e) => {
    if(!this.canTouchLoad()) {
      window.addEventListener('touchmove',(e)=>{
        e.preventDefault()
      })
      return
    }
    var endState = {
      loaderState: STATS.init,
      pullHeight: 0
    }
    if (this.state.loaderState == STATS.enough) {
      // refreshing
      this.setState({
        loaderState: STATS.refreshing,
        pullHeight: 0
      })
      this.props.onLoadMore(() => {
        // refreshed
        this.setState({
          loaderState: STATS.refreshed,
          pullHeight: 0
        })
        setTimeout(() => {
          this.setState({
            loaderState:STATS.reset,
            pullHeight:0
          })
        }, 1000)
      })
    } else {
      this.setState(endState)
    }
  }

  onScroll = () => {
    // 下拉加载

  }

  render() {
    const { pullHeight, loaderState } = this.state


    let style = pullHeight ? {
      WebkitTransform: `translate3d(0,${pullHeight}px,0)`
    } : null


    return (
      <div ref="pullpanel"
        className={`loader-container state-${loaderState}`}
        onScroll={(e) => this.onScroll(e)}
        onTouchStart={(e) => this.touchStart(e)}
        onTouchMove={(e) => this.touchMove(e)}
        onTouchEnd={(e) => this.touchEnd(e)}
      >

        <div className="pull-text">
          <div className="pull-text-inner"></div>
        </div>
        <div className="pull-content" style={style}>
          {this.props.children}
        </div>
        <style jsx>{`
          .pull-content{
            position:relative;
            background-color:#fff;
          }
          .loader-container{
            position:relative;
            overflow-y:scroll;
            height:500px;
            -webkit-overflow-scrolling:touch;
          }
          .loader-container.state-pulling{
            overflow-y:hidden;
          }
          .pull-text{
            width:100%;
            position:absolute;
            left:0;
            top:0;
            text-align:center;
            overflow:hidden;
            height:60px;
            line-height:60px;
            
          }
          .state-reset .pull-text,.state- .pull-text{
            height:0;
          }
          .state-refreshing .pull-content{
            -webkit-transform:translate3d(0,60px,0);
            -webkit-transition:-webkit-transform .2s;
          }

          .state-refreshed .pull-text{
            height:0;
          }
          .state-refreshed .pull-text{
            -webkit-transition:height .8s;
          }
          .state-refreshed .pull-content{
            -webkit-animation:refreshed .4s;
            animation:refreshed .4s;
          }



          @-webkit-keyframes refreshed {
            0%{
              -webkit-transform:translate3d(0,60px,0);
            }
            50%{
              -webkit-transform:translate3d(0,60px,0);
            }
            100%{
              -webkit-transform:translate3d(0,0,0);
            }
          }
          @keyframes refreshed {
            0%{
              -webkit-transform:translate3d(0,60px,0);
            }
            50%{
              -webkit-transform:translate3d(0,60px,0);
            }
            100%{
              -webkit-transform:translate3d(0,0,0);
            }
          }
          .pull-text-inner{
            font-size:14px;
            color:red;
          }
          .state-pulling .pull-text-inner:after{
            content:'下拉加载';
          }
          .state-reset .pull-text-inner:after{
            content:'加载完成';
          }
          .state-pulling.enough .pull-text-inner:after{
            content:'松开加载';
          }
          .state-refreshing .pull-text-inner:after{
            content:'正在加载';
          }
          .state-refreshed .pull-text-inner:after{
            content:'加载完成';
          }
        `}</style>
      </div>
    )
  }
}