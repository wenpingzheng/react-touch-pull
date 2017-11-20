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

  render() {
    return (
      <Layout>
        <TouchPull>
          <div>
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
      </Layout>
    )
  }
}
