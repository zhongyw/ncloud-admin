import React from 'react';

import {Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot} from '../common/commonHelper.js'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddExam extends React.Component{
  goBack = (event) => {
    hashHistory.push('/exams');
  }

  handleSubmit = (e) => {
   e.preventDefault();
   console.log('Received values of form:', this.props.form.getFieldsValue());
   fetch(apiRoot + '/api/createExam',
   {
         method: 'post', mode: 'cors',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.props.form.getFieldsValue())
   }).then((res) => {
     console.log(res.json());
     return res.json();
   })


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
            {getFieldDecorator('title', { initialValue: '' })(
              <Input type="textarea" placeholder="请输入问题" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
            help="请输入问题描述"
          >
            {getFieldDecorator('desc', { initialValue: '' })(
              <Input type="textarea" placeholder="请输入问题描述" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="答案"
            help="请输入答案"
          >
            {getFieldDecorator('answer', { initialValue: '' })(
              <Input type="textarea" placeholder="请输入答案" />
            )}
          </FormItem>

          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default AddExam = Form.create()(AddExam);
