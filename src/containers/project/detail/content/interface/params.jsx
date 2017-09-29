import React, { Component } from 'react';
import { Button, Table, Input, Select } from 'antd';
import { guid } from 'util/base';
const Option = Select.Option;

const COMPOSITE_TYPES = ['array', 'object'];

const columns = function() {
  var self = this;
  return [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      render(value, record, index) {
        return (
          <Input
            placeholder="请输入字段名称"
            name="name"
            value={value}
            onChange={e => self.handleField(e, index)}
          />
        );
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render(value, record, index) {
        return (
          <div>
            <Select
              defaultValue="string"
              style={{ width: 120 }}
              value={value}
              onChange={e => self.handleField(e, index, 'type')}
            >
              <Option value="string">string</Option>
              <Option value="object">object</Option>
              <Option value="array">array</Option>
              <Option value="interge">interge</Option>
              <Option value="boolean">boolean</Option>
              <Option value="float">float</Option>
              <Option value="imageurl">imageurl</Option>
              <Option value="timestamp">timestamp</Option>
              <Option value="enum">enum</Option>
            </Select>
          </div>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      render(value, record, index) {
        return (
          <Input
            placeholder="请输入字段描述"
            name="description"
            value={value}
            onChange={e => self.handleField(e, index)}
          />
        );
      }
    },
    {
      title: '操作',
      render() {
        return (
          <div>
            <Button type="primary" shape="circle" icon="plus" />
          </div>
        );
      }
    }
  ];
};

export default class HttpParams extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      let subFields = data.subFields.slice(0)
      // if (COMPOSITE_TYPES.indexOf(data.type) == -1) {
      //   subFields: []
      // }
      this.setState({
        data: subFields
      });
    }
  }
  render() {
    const { title, bordered } = this.props;
    const { data } = this.state;
    console.log('render', data);
    return (
      <Table
        dataSource={data}
        className="components-table-demo-nested"
        rowKey={record => record.id}
        bordered
        pagination={false}
        onExpand={this.expand}
        style={{ marginBottom: 20 }}
        columns={columns.call(this)}
        expandedRowRender={(record, index) => {
          return COMPOSITE_TYPES.indexOf(record.type) > -1
            ? <HttpParams  data={record} />
            : null;
        }}
        footer={() =>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={this.addField}
              type="primary"
              shape="circle"
              icon="plus"
            />
            <Button onClick={this.log} type="primary" icon="plus">
              log
            </Button>
          </div>}
      />
    );
  }

  addField = () => {
    let newData = this.state.data.slice(0);
    console.log(this.state.data);
    newData.push({
      id: guid(),
      name: '',
      type: 'string',
      description: '',
      subFields: []
    });

    this.setState(
      {
        data: newData
      },
      () => {
        this.stateOnChange();
      }
    );
  };

  stateOnChange() {
    this.props.onChange && this.props.onChange(this.state.data.slice(0));
    this.props.data && (this.props.data.subFields = this.state.data.slice(0));
  }

  expand(expanded, record) {
    // console.log('hello world', expanded, record)
  }

  handleField(e, index, field) {
    let newData = this.state.data.slice(0);
    if (field) {
      newData[index][field] = e;
      COMPOSITE_TYPES.indexOf(e) == -1 && (newData[index].subFields = [])
    } else {
      newData[index][e.target.name] = e.target.value;
    }
    this.setState(
      {
        data: newData
      },
      () => {
        this.stateOnChange();
      }
    );
  }

  log = () => {
    console.log(this.state);
  };
}
