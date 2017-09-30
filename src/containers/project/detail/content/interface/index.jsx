import React, { Component } from 'react';
import { Input, Table, Button, Select } from 'antd';
import interfaceAPI from 'api/interface';
import HttpParams from './params';
import './style.scss';

const Option = Select.Option;

const TYPES = ['array', 'object'];
const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
const handleJSON = data => {
  let result;
  try {
    result = JSON.parse(data);
    if (Object.prototype.toString.call(result) !== '[object Array]') {
      result = [result];
    }
  } catch (err) {
    result = [];
  }
  return result;
};

export default class DocInterface extends Component {
  state = {
    url: '',
    title: '',
    method: 'get',
    reqParams: {subFields: []},
    res: {subFields: []}
  };
  componentDidMount() {
    let { data } = this.props;
    let reqParams = handleJSON(data.reqParams);
    let res = handleJSON(data.res);
    this.setState({
      url: data.path,
      title: data.title,
      // reqParams: reqParams,
      // res: res
      reqParams: {
        subFields: reqParams
      },
      res: {
        subFields: res
      }
    });
  }

  render() {
    let { data } = this.props;
    let { title, url, method, reqParams, res } = this.state;
    
    return (
      <div className="doc-interface">
        <h3 className="sub-title">接口标题</h3>
        <Input
          placeholder="请输入接口标题"
          name="title"
          value={title}
          onChange={this.handleField}
          size="large"
          className="doc-interface__url"
        />
        <h3 className="sub-title">请求路径</h3>
        <Input
          placeholder="请输入接口url"
          name="url"
          value={url}
          onChange={this.handleField}
          size="large"
          className="doc-interface__url"
        />
        <h3 className="sub-title">请求方法</h3>
        <Select
          defaultValue="string"
          style={{ width: 120 }}
          value={method}
          onChange={this.handleMethod}
        >
          {METHODS.map((method, index) => {
            return (
              <Option key={index} value={method}>
                {method}
              </Option>
            );
          })}
        </Select>
        <h3 className="sub-title">请求参数</h3>
        <HttpParams  data={reqParams} />
        <h3 className="sub-title">响应数据</h3>
        <HttpParams data={res}/>
        <Button onClick={this.save}>保存</Button>
      </div>
    );
  }

  handleField = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleMethod = value => {
    this.setState({
      method: value
    });
  };


  save = () => {
    const { title, url, method, reqParams, res } = this.state;
    const data = this.props.data;
    const docId = this.props.docId;
    let result;
    console.log(reqParams, res);
    let postData = {
      title,
      path: url,
      reqParams: JSON.stringify(reqParams.subFields),
      res: JSON.stringify(res.subFields),
      docId,
      type: 1,
      method
    };
    
    if (!data.id) {
      result = interfaceAPI.addInterface(postData);
    } else {
      postData.id = data.id;
      result = interfaceAPI.updateInterface(postData);
    }
    result.then(res => {

    })
  };
}
