import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Route, Link } from 'react-router-dom';
import Project from './containers/project';
import ProjectDetail from 'containers/project/detail';
import './App.scss';

const { Header, Content } = Layout;

class App extends Component {
  render() {
    return (
      <div className="app">
        <Layout className="app__container">
          <Header className="app__header">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              className="app__header__menu"
            >
              <Menu.Item key="1">
                <Link to="/project">项目</Link>
              </Menu.Item>
              <Menu.Item key="2">1111</Menu.Item>
              <Menu.Item key="3">22222</Menu.Item>
            </Menu>
            <div className="app__header__userinfo">
              <img
                className="avator"
                alt="avator"
                src="//tva4.sinaimg.cn/crop.52.17.156.156.180/a7c74231jw8f7d9zqcjz4j2064064a9z.jpg"
              />
              <span className="name">hzh</span>
            </div>
          </Header>
          <Content className="app__content">
            <Route path="/project" exact component={Project} />
            <Route path="/project/:id" component={ProjectDetail} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
