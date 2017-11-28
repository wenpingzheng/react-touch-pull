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
    if (!this.canTouchLoad()) {
      window.addEventListener('touchmove', (e) => {
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
   
    if (!this.canTouchLoad()) {
      window.addEventListener('touchmove', (e) => {
        e.preventDefault()
      })
      return
    }
    
    let scrollTop = this.refs.pullpanel.scrollTop
    let distance = e.touches[0].clientY - this._initialTouch.clientY
    if (distance > 0 && scrollTop <= 0) {
      let pullDistance = distance - this._initialTouch.scrollTop
      if (pullDistance < 0) {
        pullDistance = 0
        this._initialTouch.scrollTop = distance
      }
      let pullHeight = this.easing(pullDistance)
      if (pullHeight) e.preventDefault();// 减弱滚动

      this.setState({
        loaderState: pullHeight > STATS.distanceToRefresh ? STATS.enough : STATS.pulling,
        pullHeight: pullHeight
      })
    }
  }

  touchEnd = (e) => {
    if (!this.canTouchLoad()) {
      window.addEventListener('touchmove', (e) => {
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
      this.props.onRefresh(() => {
        // resolve
        this.setState({
          loaderState: STATS.refreshed,
          pullHeight: 0
        })
      }, () => {
        // refresh
        this.setState({
          loaderState: STATS.reset,
          pullHeight: 0
        })
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
        onTouchStart={(e) => this.touchStart(e)}
        onTouchMove={(e) => this.touchMove(e)}
        onTouchEnd={(e) => this.touchEnd(e)}
      >

        <div className="pull-text">
          <div className="pull-text-inner"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODIyQTg2NDZFQjUwOTZENiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NzQ2ODZCMTcxQjIxMUU3OTcwM0RDODdBQTkwNDcwQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NzQ2ODZCMDcxQjIxMUU3OTcwM0RDODdBQTkwNDcwQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzRDQ0YzMTQxRjIwNjgxMTgzRDE5NjI4NkMwMzY2QzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgyMkE4NjQ2RUI1MDk2RDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4YRTk2AAAD9ElEQVR42qyY2UtVURTGr8draZY2mZQDpZXYYCqVUhCUFkGDUfQURlkv/QH9E/VYL0U9VVREUA8NVGC+BIqVaGmTE9qkdjU1G5z6VnxXttu9z2Au+IHuM9xv77X22mudmNIz46GAthisAulgCUgGsaATtINXYDYYBl1gzO1lj09P/j/sU0QcyAObQaoy/hk8BI3gF8gHFSCe1/+AN+AlaAOes/cjaAMoBfOUse8U0qSMyYqVgRhlbBYnInwEj7iK0xI0BxwAq7VxmfEdrohqazUxuqWB46AOPAC/gwhaCMrBAm28FtyzLL3j0/35FHcF9Pt5iYg5ZhDT5CImpLnPy1K4WvO9BImbjoIkbbyPbnILSgnaSj+BS5MJH9l5dmIDTBEk/j9oUg27b/O5ZlXgAnjttd2VlSqzCSoEKw0PSX55F8AdX8AtcA7UgBGP+3OxSut1QbI9d1geqAlNz3q5sudBg8e9uyAqTt1lG0Gi4cZhbnOTySSKwDpmb8nWQ6ADPFPyjcTfbb5nL0gwvEtyXIFM3lEEmayV2daUo06CEmbuWGU8hzuoWHtG4uoi6LH81qaoy9K41UOW+DHZPp5jbrYbZBjceJlZe0qAw20pIijbI0BNeSrXZxxtMYz9BFfBN8O1HIdnkM36DWMrAgR2lmVcRN1gjKqW6bi4S2zAMLYogCApQ+ZarnUzkU5ym2M4IlQbtQR0EEt0uVbNuJq411F2iMliDauTF1DQNo8JV6upxOuETjBsTSegoDUeXmhQzz+Hycxm8YaaJ6jFMHnaStgfrDzFhhzNh24rlMSM2hdAzCAP2aU+zr9/uzrMJJXmI4YGeZJ3MROn+xAkZ9knj0oyWhKLdckKfXC58avy9xiXNkcr9N2siCHR63FftLTpEEHvLYV3neVFWexC/FiGSx7S85VYc5gRLql8K+uhUZ7M1S5uaJGsyqAf4oQktpaz6BrhZGSyEeXZZMZil1bwiehOBHgkWn7Ii+rBUx+zGWMf1ujh4pAmZI/SwQyz83ihVI7P1QKtjaVkcmjmTarBU1o7JS7fLy7FCe9whepVQcNUewIsmyEhcsQcIvGWewrpnUq4a1Tvy+qZVaUVfsIYGp+GkDB/aLulOtSrzgGIaTE1ivLjd1kJ7uZLq9hv+ekgkumeYp87S6wdYrrdOtch7rgKVoSHgaT2t6yVe/i/w9kn0cWZhurQy1qjgezVSkdYZpazVkrkahXOYKCLi66byhvHpYW5FLA99msSm9cM1aLn1w9x303GRYmlow1iPcw9zf/7faiBSbCA9VBqQCEdXJVGP5vD7xe0UX6KqWVWzeZpn8riK6zksz5m7GgLHgmi/q8AAwD0MuOlE3cFFwAAAABJRU5ErkJggg=="/></div>
        </div>
        <div className="pull-content" style={style}>
          {this.props.children}
        </div>
       
        <style jsx>{`
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

          .pull-content{
            position:relative;
            background-color:#fff;
           
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;// enhance ios scrolling
            overflow-scrolling: touch;// enhance ios scrolling
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
            right:0;
            text-align:center;
            overflow:hidden;
            height:60px;
            line-height:60px;
            
          }
          .state-reset .pull-text,.state- .pull-text{
           // height:0;
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
            position:relative;
            display:inline-block;
            font-size:14px;
            color:#b7b7b7;
            padding-left:29px;
          }
          img{
            width:24px;
            position:absolute;
            left:0;
            top:50%;
            margin-top:-12px;
            // -webkit-transform:translate(0,-50%);
            // transform:translate(0,-50%);
          }

          .state-refreshing img{
            -webkit-animation:rotating 1s linear infinite both;
            animation:rotating 1s linear infinite both;

          }

         
          @-webkit-keyframes rotating {
            from{
              -webkit-transform:rotate(0);
              transform:rotate(0);
            }
            to{
              -webkit-transform:rotate(360deg);
              transform:rotate(360deg);
            }
          }
          @keyframes rotating {
            from{
              -webkit-transform:rotate(0);
              transform:rotate(0);
            }
            to{
              -webkit-transform:rotate(360deg);
              transform:rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }
}