import React, { Component } from 'react';
import {
  Form,
  Input,
  Button
} from 'antd';
const FormItem = Form.Item;

class AddProject extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addProject(values);
        console.log('Received values of form: ', values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="项目名">
          {getFieldDecorator('name')(
            <Input />
          )}
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddProject);


