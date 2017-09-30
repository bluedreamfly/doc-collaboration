import React, { Component } from 'react'
import { Button } from 'antd'
import Tree from 'components/Tree'
import TreeMenu from './TreeMenu'
import './style.scss'

export default class Slide extends Component {
  render() {
    const { menuData, opTreeNode } = this.props;
    return (
      <div className="doc-slide">
        <div>
          <Button>添加目录</Button>
        </div>
        <div>
          { menuData && <TreeMenu data={menuData} opTreeNode={opTreeNode}/> }
        </div>
      </div>
    )
  }
}