import React, { Component } from 'react';
import { Modal } from 'antd';
import projectAPI from 'api/project'
import ProjectList from './list';
import AddProject from './add';
import './style.scss';

console.log(projectAPI);

export default class Project extends Component {
  state = {
    list: [],
    modalVisible: false
  };

  componentDidMount() {
    projectAPI.fetchProjects().then(res => {
      this.setState({list: res.data.data || []})
    })
  }

  render() {
    const { list, modalVisible } = this.state;
    return (
      <div className="project">
        <ProjectList list={list} addProject={() => this.setState({modalVisible: true})}/>
        <Modal
          title="添加项目"
          onCancel={() => this.setState({ modalVisible: false })}
          footer={null}
          visible={modalVisible}
        >
          <AddProject addProject={this.addProject}/>
        </Modal>
      </div>
    );
  }

  addProject = (values) => {

    let { name } = values;
    projectAPI.addProject({name}).then(res => {
      let plist = this.state.list.slice(0);
      plist.push(res.data.data || {})
      this.setState({list: plist, modalVisible: false})
    })

    
  };
}
