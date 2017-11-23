
import Head from 'next/head'

export default ({ children }) => (
  <div>
    <Head>
      <title>移动端下拉加载数据测试页</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,user-scalable=no" />
      <style>{`*{margin:0;padding:0}html,body{overflow:hidden;width:100%;height:100%;}li{font-size:24px}body{background-color:#ddd;}`}</style>
    </Head>
    {children}
  </div>
)