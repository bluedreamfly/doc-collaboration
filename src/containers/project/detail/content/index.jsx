import React, { Component } from 'react';
import { Input, Button } from 'antd';
import documentAPI from 'api/document'
import './style.scss';
import DocInterface from './interface';
const { TextArea } = Input;

export default class DocContent extends Component {
  state = {
    interfaces: [],
    title: '',
    description: ''
  };

  render() {
    const { interfaces, title, description } = this.state;
    const { projectId, dirId } = this.props;
    return (
      <div className="doc-content">
        <Input
          placeholder="请输入文档标题"
          size="large"
          name="title"
          value={title}
          onChange={this.handleField}
          className="doc-content__title"
        />
        <TextArea
          rows={4}
          placeholder="请输入文档描述"
          name="description"
          onChange={this.handleField}
          size="large"
          value={description}
          className="doc-content__title"
        />
        <div className="doc-content__operate">
          <Button  onClick={this.addInterface}>添加接口</Button>
          <Button onClick={this.save}>保存</Button>
        </div>
        <h2 style={{ padding: '10px 0' }}>接口部分</h2>

        {interfaces &&
          interfaces.map((item, index) => {
            return <DocInterface key={index} />;
          })}
      </div>
    );
  }

  handleField = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addInterface = () => {
    let interfaces = this.state.interfaces.slice(0);
    interfaces.push({});
    this.setState({
      interfaces
    });
  };

  save = () =>{
    let { title, description } = this.state;
    const { projectId, dirId, fetchProjectMenu } = this.props;
    
    documentAPI.addDocument({title, description, projectId, dirId})
      .then(res => {
        fetchProjectMenu();
      })
  }
}
