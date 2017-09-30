import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';
import documentAPI from 'api/document';
import DocInterface from './interface';
import ImportData from './importData';

import './style.scss';
const { TextArea } = Input;

export default class DocContent extends Component {
  state = {
    interfaces: [],
    title: '',
    description: '',
    docId: '',
    visible: false
  };

  componentDidMount() {
    this.fetchDocumentDetail(this.props.document);
  }

  fetchDocumentDetail(document) {
    if (document) {
      documentAPI.getDocumentDetail(document.id).then(res => {
        let { title, description, interfaces } = res.data.data;

        this.setState({ title, description, interfaces, docId: document.id });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.document);
    if (
      nextProps.document &&
      (!this.props.document || nextProps.document.id != this.props.document.id)
    ) {
      this.fetchDocumentDetail(nextProps.document);
    }
    if (!nextProps.document && nextProps.isAdd) {
      this.setState({
        title: '',
        description: '',
        interfaces: [],
        docId: ''
      });
    }
  }

  render() {
    const { interfaces, title, description, docId, visible } = this.state;
    const { projectId, dirId } = this.props;
    console.log(docId);
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
        <div className=" ">
          <Button onClick={this.save}>保存</Button>
        </div>
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ padding: '10px 0' }}>接口部分</h2>

          {interfaces &&
            interfaces.map((item, index) => {
              return (
                <DocInterface
                  key={item.id || Math.random()}
                  docId={docId}
                  data={item}
                />
              );
            })}
        </div>
        {docId &&
          <div className="doc-content__operate">
            <Button type="primary" onClick={this.addInterface}>
              添加接口
            </Button>
            <Button
              type="primary"
              onClick={() => this.setState({ visible: true })}
            >
              导入数据
            </Button>
          </div>}

        { visible && <Modal
          title="导入数据"
          width="60%"
          visible={visible}
          footer={null}
          onCancel={() => this.setState({ visible: false })}
        >
          <ImportData />
        </Modal>}
      </div>
    );
  }

  handleField = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addInterface = () => {
    let interfaces = this.state.interfaces.slice(0);
    interfaces.push({});
    this.setState({
      interfaces
    });
  };

  save = () => {
    let { title, description, docId } = this.state;
    const { projectId, dirId, fetchProjectMenu, setData } = this.props;
    let postData = { title, description, projectId };
    if (docId) {
      postData.id = docId;
      documentAPI.updateDocument(postData).then(res => {
        fetchProjectMenu();
      });
    } else {
      postData.dirId = dirId;
      documentAPI.addDocument(postData).then(res => {
        fetchProjectMenu();
        setData({ isAdd: false, document: res.data.data });
        this.setState({
          docId: res.data.data.id
        });
      });
    }
  };
}
