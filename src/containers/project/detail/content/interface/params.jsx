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
      render(value, record, index) {
        return (
          <div>
            <Button type="primary" onClick={() => self.delField(index)} shape="circle" icon="delete" />
          </div>
        );
      }
    }
  ];
};

export default class HttpParams extends Component {
  state = {
    data: [],
    expandedRowKeys: []
  };
  
  componentDidMount() {
    this.handlePropsData(this.props.data);
  }

  handlePropsData(data) {
    
    const keys = this.state.expandedRowKeys.slice(0);
    if (data) {
      let subFields = data.subFields
      subFields.forEach(field => {
        keys.push(field.id);
      })
      this.setState({
        data: subFields,
        expandedRowKeys: keys
      });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.handlePropsData(nextProps.data);
  }


  render() {
    const { title, bordered } = this.props;
    const { data, expandedRowKeys } = this.state;
    return (
      <Table
        dataSource={data}
        className="components-table-demo-nested"
        rowKey={record => record.id}
        bordered
        expandedRowKeys={expandedRowKeys}
        pagination={false}
        style={{ marginBottom: 20 }}
        columns={columns.call(this)}
        onExpand={this.expand}
        expandedRowRender={(record, index) => {
          return COMPOSITE_TYPES.indexOf(record.type) > -1
            ? <HttpParams data={record} />
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
            {/*<Button onClick={this.log} type="primary" icon="plus">
              log
            </Button>*/}
          </div>}
      />
    );
  }

  addField = () => {
    let newData = this.state.data.slice(0);
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

  delField = (index) => {
    let newData = this.state.data.slice(0);
    newData.splice(index, 1);
    this.setState(
      {
        data: newData
      },
      () => {
        this.stateOnChange();
      }
    );
  } 

  


  stateOnChange() {
    
    let { data} = this.props;
    if (data) {
      let newData = data.subFields ? data.subFields : data
      newData = this.state.data.slice(0);
      if (data.subFields) {
        data.subFields = newData;
      }
    }   
  }

  expand = (expanded, record) =>{
    let keys = this.state.expandedRowKeys.slice(0); 
    if (expanded) {
      keys.push(record.id);
    } else {
      let index = keys.indexOf(record.id);
      keys.splice(index, 1);
    }
    this.setState({
      expandedRowKeys: keys
    })
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
    console.log(this.props.data)
  };
}
