import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Icon } from 'antd';
import Card from './card';
import './style.scss';

export default class ProjectList extends Component {
  render() {
    const { list, addProject } = this.props;
    return (
      <div className="project-list">
        {list &&
          list.map(project => {
            return <Link key={project.id} to={`/project/${project.id}`}><Card data={project}/></Link>;
          })}
        <div className="add-project" onClick={addProject}>
          <Icon type="plus"/>
        </div>
      </div>
    );
  }
}
