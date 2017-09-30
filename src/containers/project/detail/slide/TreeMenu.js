import React from 'react';
import { Tree, Icon, Button, Input } from 'antd';
import { guid } from 'util/base';

const TreeNode = Tree.TreeNode;

const loop = (data, key, callback) => {
  data.forEach((item, index, arr) => {
    if (item.id === key) {
      return callback(item, index, arr);
    }
    if (item.children) {
      return loop(item.children, key, callback);
    }
  });
};

const MenuTitle = ({ data, handleNode, handleChange, parent, saveRename }) => {
  let { isDoc, name, isOpen, isSelected, isEdit } = data;
  return (
    <div className="menu-title">
      <Icon type={isDoc ? 'file' : isOpen ? 'folder-open' : 'folder'} />
      <span className="doc-tree__node__title">
        {isEdit
          ? <Input
              onChange={e => handleChange(e, data)}
              onClick={e => e.stopPropagation()}
              onKeyPress={e => saveRename(e, data, parent)}
              value={name}
              style={{ width: 160 }}
            />
          : name}
      </span>
      {isSelected &&
        <div className="menu-title__op">
          {!isDoc &&
            <Button
              icon="folder-add"
              onClick={e => handleNode(e, 'add_dir', data, parent)}
              shape="circle"
              type="primary"
              size="small"
            />}
          {!isDoc &&
            <Button
              icon="file-add"
              onClick={e => handleNode(e, 'add_doc', data, parent)}
              shape="circle"
              type="primary"
              size="small"
            />}
          <Button
            icon="edit"
            shape="circle"
            type="primary"
            onClick={e => handleNode(e, 'edit', data)}
            size="small"
          />
          <Button
            icon="delete"
            shape="circle"
            type="primary"
            size="small"
            onClick={e => handleNode(e, 'delete', data)}
          />
        </div>}
    </div>
  );
};

const gKeys = [];
export default class TreeMenu extends React.Component {
  state = {
    data: [],
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
    type: '',
    currentNode: null
  };

  componentDidMount() {
    this.setState({
      data: this.props.data.children
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data.children
    });
  }

  render() {
    const {
      expandedKeys,
      autoExpandParent,
      selectedKeys,
      type,
      currentNode
    } = this.state;
    // console.log(type, currentNode, selectedKeys);
    const loop = (data, parent) =>
      data.map(item => {
        if (!item.isDoc && item.children && item.children.length > 0) {
          if (expandedKeys.indexOf(item.id) > -1) {
            item.isOpen = true;
          } else {
            item.isOpen = false;
          }
        }
        if (currentNode && item.id === currentNode.id) {
          item.isEdit = true;
        } else {
          item.isEdit = false;
        }
        if (selectedKeys.indexOf(item.id) > -1) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
        const title = (
          <MenuTitle
            data={item}
            parent={parent}
            handleNode={this.handleNode}
            handleChange={this.handleChange}
            saveRename={this.saveRename}
          />
        );
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.id} title={title}>
              {loop(item.children, item)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={title} />;
      });
    return (
      <Tree
        className="draggable-tree"
        expandedKeys={expandedKeys}
        onExpand={this.onExpand}
        autoExpandParent={autoExpandParent}
        draggable
        onSelect={this.selectNode}
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        selectedKeys={selectedKeys}
      >
        {loop(this.state.data)}
      </Tree>
    );
  }

  saveRename = (e, data, parent) => {
    console.log(data, parent);
    let { type } = this.state;
    if (e.key == 'Enter') {
      this.setState({
        currentNode: null
      });
      if (data.originName == data.name) return;
      if (type == 'edit') {
        this.props.opTreeNode('rename_save', null, data);
      }
      if (type == 'add_dir') {
        this.props.opTreeNode('add_dir', parent, data);
      }
      if (type == 'add_doc') {
        this.props.opTreeNode('add_doc', parent, data);
      }
    }
  };

  handleChange = (e, data) => {
    e.stopPropagation();
    data.name = e.target.value;
    this.setState({ data: this.state.data });
  };

  handleNode = (e, type, data, parent) => {
    e.stopPropagation();
    if (type === 'edit') {
      data.originName = data.name;
      this.setState({ type, currentNode: data });
    }
    if (type === 'add_doc') {
      this.props.opTreeNode('add_doc', parent, data);
      return;
    }
    if (type == 'delete') {
      this.props.opTreeNode('delete', parent, data);
      return;
    }
    if (type === 'add_dir') {
      // console.log(data);
      let newDir = {
        id: guid(),
        name: '',
        isDoc: false
      };
      data.children.push(newDir);
      this.setState({ data: this.state.data, currentNode: newDir, type: type });
    }
    
  };

  onExpand = (selectedKeys, e) => {
    this.setState({ expandedKeys: selectedKeys, autoExpandParent: false });
  };

  selectNode = (selectedKeys, e) => {
    // console.log(e);
    let currentKey = e.node.props.eventKey;
    let keys = this.state.expandedKeys.slice(0);
    let index = keys.indexOf(currentKey);
    if (index == -1) {
      keys.push(currentKey);
    } else {
      let index = keys.indexOf(currentKey);
      keys.splice(index, 1);
    }
    
    
    this.setState({
      expandedKeys: keys,
      autoExpandParent: false,
      selectedKeys: selectedKeys
    });

    if (selectedKeys.length > 0) {
      loop(this.state.data, selectedKeys[0], (item, index, arr) => {
        if (item.isDoc) {
          this.props.opTreeNode('look_doc', null, item);
        }
      })
    }
  };

  onDragEnter = info => {
    console.log(info.expandedKeys);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  onDrop = info => {
    // console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition;
    // - Number(dropPos[dropPos.length - 1]);

    // console.log(info.dropPosition);
    // const dragNodesKeys = info.dragNodesKeys;
    
    const data = [...this.state.data];
    let dragObj;
    let isRemove = true;
    let dragArr;
    let dragIndex;
    loop(data, dragKey, (item, index, arr) => {
      dragArr = arr;
      dragIndex = index;
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(dropPosition, 0, dragObj);
      }
    } else {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        if (!item.isDoc) {
          item.children.push(dragObj);
        } else {
          isRemove = false;
        }
      });
    }
    if (isRemove) {
      dragArr.splice(dragIndex, 1);
    }

    this.setState({
      data: data
    });
  };
}
