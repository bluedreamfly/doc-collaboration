import React, { Component } from 'react';
import { Input, Table, Button } from 'antd';
import HttpParams from './params'
import './style.scss'

export default class DocInterface extends Component {

  state = {
    url: '',
    reqParams: [],
    res: []
  }

  render() {
    return (
      <div className="doc-interface">
        <h3 className="sub-title">请求路径</h3>
        <Input placeholder="请输入接口url" size="large" className="doc-interface__url"/>
        <h3 className="sub-title">请求参数</h3>
        <HttpParams  onChange={this.getReqData}/>
        <h3 className="sub-title">响应数据</h3>
        <HttpParams  onChange={this.getResData}/>
        <Button onClick={this.save}>保存</Button>
      </div>
    );
  }

  save = () => {
    console.log(this.reqParams, this.res);
  }

  getReqData = (data) => {
    this.reqParams = data;
    // this.setState({
    //   reqParams: data
    // })
  }

  getResData = (data) => {
    this.res = data;
  }
}
