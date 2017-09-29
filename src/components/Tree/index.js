import React, { Component } from 'react';
import { Button, Icon, Menu, Dropdown, Input } from 'antd';
import './style.scss';

const RENAME = 'rename';
const DELETE = 'delete';
const UPDATE_DIR = 'update_dir';
const ADD_DIR = 'add_dir';
const ADD_DOC = 'add_doc';

const commonMethods = [
  { type: RENAME, title: '重名名' },
  { type: DELETE, title: '删除' },
  { type: UPDATE_DIR, title: '修改目录' }
];
const dirMethods = [
  { type: ADD_DIR, title: '添加目录' },
  { type: ADD_DOC, title: '添加文档' }
];

export default class Tree extends Component {
  state = {
    data: {},
    currentParent: null,
    currentNode: null
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.data, this.props.data)
    // if (nextProps.data != this.props.data) {
      this.setState({data: nextProps.data})
    // }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    });
    // document.body.addEventListener('keydown', this.saveRename)
  }

  componentWillUnmount() {
    // document.body.removeEventListener('keydown', this.saveRename)
  }

  render() {
    return (
      <div>
        {this.generateNav(this.state.data)}
      </div>
    );
  }

  selectNode = (data, item) => {
    this.clearSelect(this.state.data, 'isSelected');
    item.isSelected = true;
    this.setState({
      data: this.state.data,
      currentParent: data,
      currentNode: item
    });
  };

  clearSelect = (data, field) => {
    if (data.children) {
      data.children.forEach(item => {
        item[field] = false;
        if (item.children) {
          this.clearSelect(item, field);
        }
      });
    } else {
      data[field] = false;
    }
  };

  generateNav(data) {
    if (data.children) {
      return (
        <ul className="doc-tree">
          {data.children.map((item, key) => {
            const color = {color: item.isSelected ? 'red' : ''};
            return (
              <li key={item.id}>
                <div
                  className="doc-tree__node"
                  onClick={() => this.selectNode(data, item)}
                >
                  <span style={color}>
                    {<Icon type={item.isDoc ? 'file' : 'folder'} />}
                    { !item.isRename ? <span className="doc-tree__node__title" >
                      {item.name}
                    </span> : <Input value={item.name} onKeyPress={(e) => this.saveRename(e, item)} onChange={(e) => this.rename(e, item)} style={{width: 150}}/>}
                  </span>

                  {item.isSelected &&
                    <Dropdown
                      overlay={this.generateDropDown(item)}
                      trigger={['hover']}
                    >
                      <Icon type="menu-fold" />
                    </Dropdown>}
                </div>
                {this.generateNav(item)}
              </li>
            );
          })}
        </ul>
      );
    }
  }

  saveRename = (e, item) => {
    if (e.key == 'Enter'){
      item.isRename = false;
      this.setState({
        data: this.state.data
      })
      this.props.opTreeNode('rename_save',null, item);
    }
  }

  rename = (e, item) => {
    item.name = e.target.value;
    this.setState({
      data: this.state.data
    })
  }

  generateDropDown = item => {
    let menus = [...commonMethods];
    if (!item.isDoc) {
      menus = [...dirMethods, ...menus];
    }
    return (
      <Menu onClick={this.opTreeNode}>
        {menus.map((menu, index) => {
          return (
            <Menu.Item key={menu.type}>
              {menu.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  opTreeNode = (e) => {
    const { currentParent, currentNode } = this.state;
    if (e.key == 'rename') {
      this.clearSelect(this.state.data, 'isRename');
      currentNode.isRename = true;
      this.setState({
        data: this.state.data
      })
    }
    this.props.opTreeNode(e.key, currentParent, currentNode);
    console.log(e.key);
  }
}
