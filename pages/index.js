/**
 * main file
 * @time 2017-11-20
 * @author wpzheng
 */

import { Component } from 'react'
import Layout from '../Layouts/Layout'
import TouchPull from '../components/TouchPull'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }
  canLoad = true
  refresh = (resolve,reject) => {
    console.log('loadMore')
    if(this.canLoad) {
      this.canLoad= false;
      setTimeout(()=>{
        resolve()
        this.canLoad = true
      },5000)
    }
  }
  render() {
    return (
      <Layout>
        {/*
        <div className="nav-title">
          <h2>用来测试的标题</h2>
        </div>*/}
        <TouchPull 
          onRefresh={(resolve, reject) => this.refresh(resolve, reject)}
        >
          <div className="wrapper">
            <ul>
              <li>这是第一行数据</li>
              <li>这是第二行数据</li>
              <li>这是第三行数据</li>
              <li>这是第四行数据</li>
              <li>这是第五行数据</li>
              <li>这是第六行数据</li>
              <li>这是第一行数据</li>
              <li>这是第二行数据</li>
              <li>这是第三行数据</li>
              <li>这是第四行数据</li>
              <li>这是第五行数据</li>
              <li>这是第六行数据</li>
              <li>这是第一行数据</li>
              <li>这是第二行数据</li>
              <li>这是第三行数据</li>
              <li>这是第四行数据</li>
              <li>这是第五行数据</li>
              <li>这是第六行数据</li>
            </ul>
          </div>
        </TouchPull>
        <style>{`
          .nav-title{
            width:100%;
            height:46px;
            line-height:46px;
            font-size:14px;
            color:#fff;
            background-color:#000;
            position:fixed;
            left:0;
            top:0;
            z-index:1000;
            text-align:center;
          }
          .wrapper{
            //margin-top:46px;
          }
        `}</style>
      </Layout>
    )
  }
}
