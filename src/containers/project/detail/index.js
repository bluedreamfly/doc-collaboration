import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import projectAPI from 'api/project';
import directoryAPI from 'api/directory';
import documentAPI from 'api/document';
import Slide from './slide';
import DocContent from './content';

import './style.scss';

export default class ProjectDetail extends Component {
  state = {
    menuData: null,
    isAdd: false,
    directory: null,
    document: null
  };

  componentDidMount() {
    this.fetchProjectMenu();
  }

  fetchProjectMenu = () => {
    const { id } = this.props.match.params;
    projectAPI.getProjectMenu(id).then(res => {
      this.setState({
        menuData: res.data.data || {}
      });
    });
  };

  render() {
    const { menuData, isAdd, directory, document } = this.state;
    const { id } = this.props.match.params;
    return (
      <div className="project-detail">
        <Slide menuData={menuData} opTreeNode={this.opTreeNode} />
        <div className="project-detail__doc">
          {isAdd || document
            ? <DocContent
                fetchProjectMenu={this.fetchProjectMenu}
                projectId={id}
                isAdd={isAdd}
                setData={this.setData}
                document={document}
                dirId={directory ? directory.id : null}
              />
            : null}
        </div>
      </div>
    );
  }

  setData = (data) => {
    this.setState({...this.state, ...data})
  }

  opTreeNode = (type, parent, current) => {
    const { id } = this.props.match.params;
    if (type == 'add_doc') {
      this.setState({
        isAdd: true,
        directory: current,
        document: null
      });
    }
    if (type == 'look_doc') {
      this.setState({
        document: current,
        isAdd: false
      })
    }
    if (type == 'add_dir') {
       
      directoryAPI.addDirectory({projectId: id, name: current.name, dirId: parent.id})
        .then(res => {
          if (res.data.code == 0) {
            this.fetchProjectMenu();
            message.info('添加目录成功');
          }
        })
    }
    if (type == 'rename_save') {
      let { name, id } = current;
      if (current.isDoc) {
        documentAPI.updateDocument({ title: name, id: id }).then(res => {
          if (res.data.code == 0) {
            message.info('重命名成功');
          }
        });
      } else {
        directoryAPI.updateDirectory({ name, id }).then(res => {
          if (res.data.code == 0) {
            message.info('重命名成功');
          }
        });
      }
    }
    if (type == 'delete') {
      if (!current.isDoc) {
        directoryAPI.delDirectory(current.id).then(res => {
          this.fetchProjectMenu();
        });
      } else {
        documentAPI.delDocument(current.id).then(res => {
          this.fetchProjectMenu();
        });
      }
    }
  };
}
