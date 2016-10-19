import React from 'react';

import {Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddExam extends React.Component{
  constructor(props){
      super(props);
      this.state = {
          visible : false,
          showModel: false
      }
  }

  handleOk = () => {
    this.setState({
      showModel: false,
    });
    this.goBack();
  }

  handleCancel = () => {
    this.setState({
      showModel: false,
    });
    this.handleReset();
  }

  goBack = (event) => {
    hashHistory.push('/exams');
  }
  handleReset = (e) => {
      // e.preventDefault();
      this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      // console.log('Received values of form:', this.props.form.getFieldsValue());
      fetch(apiRoot + '/api/createExam',
      {
            method: 'post', mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.EDITOR)
            },
            body: JSON.stringify(this.props.form.getFieldsValue())
      }).then((res) => {
        return res.json();
      }).then((data) => {
        this.setState({showModel: true});
        // this.goBack();
      })
    });

  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div id="wrap">
        <Button type="primary" onClick={this.goBack} icon="rollback">返回</Button>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', { initialValue: '',
              rules: [
                { required: true, min: 5, message: '标题不能少于五个字符' },
              ],
            })(
              <Input type="textarea" placeholder="请输入问题" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"

          >
            {getFieldDecorator('desc', { initialValue: '' ,
                rules: [
                  { required: true, min: 5, message: '描述不能少于五个字符' },
                ],
              })(
              <Input type="textarea" placeholder="请输入问题描述" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="答案"
          >
            {getFieldDecorator('answer', { initialValue: '' ,
              rules: [
                { required: true, min: 5, message: '答案不能少于五个字符' },
              ],
            })(
              <Input type="textarea" placeholder="请输入答案" />
            )}
          </FormItem>

          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="ghost"  onClick={this.handleReset} style={{marginLeft:10}}>重置</Button>
          </FormItem>
        </Form>
        <Modal title="Modal" visible={this.state.showModel}
          onOk={this.handleOk} onCancel={this.handleCancel}
          okText="返回列表" cancelText="继续添加"
        >
          <p>添加成功!</p>
        </Modal>
      </div>
    )
  }
}

export default AddExam = Form.create()(AddExam);
