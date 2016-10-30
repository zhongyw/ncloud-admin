import React from 'react';

import {Button,Select, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ExamForm extends React.Component{
  constructor(props){
      super(props);
      this.state = {
          visible : false,
          showAddModel: false,
          categories: []
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
      showAddModel: false,
    });
    this.handleReset();
  }

  getCategories = () => {
    fetch(apiRoot + '/api/categories',
    {
          method: 'get', mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': generateAuthorization(constants.role.EDITOR)
          }
    }).then((res) => {
      return res.json();
    }).then((data) => {
      this.setState({categories: data.categories});
      console.log(data.categories);
      // this.goBack();
    })
  }

  goBack = (event) => {
    hashHistory.push('/exams');
  }
  handleReset = (e) => {
      // e.preventDefault();
      this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    if(this.props.type === 'add'){
      this.submitAdd(e);
    }else{
      this.submitEdit(e);
    }
  }
  submitEdit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      // console.log('Received values of form:', this.props.form.getFieldsValue());
      fetch(apiRoot + '/api/exams/' + this.props.examId,
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
        message.success('修改成功');
        setTimeout(()=>{this.goBack();}, 1000);
      })
    });
  }
  submitAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      // console.log('Received values of form:', this.props.form.getFieldsValue());
      fetch(apiRoot + '/api/exams',
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
        this.setState({showAddModel: true});
      })
    });
  }
  checkCategory = (rule, value, callback) => {
    if(value === '请选择'){
      callback(new Error("请选择分类"));
    }else{
      callback();
    }
  }
  componentDidMount() {
      this.getCategories();
  }
  render(){
    const { getFieldDecorator } = this.props.form,
          formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          },
          categoryOptions = this.state.categories.map(category => <Option key={category.id}>{category.name}</Option>);

    return (
      <div>
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
            label="分类"
          >
            {getFieldDecorator('category_id', { initialValue: '请选择',
              rules: [
                { required: true, message: '请选择分类' },
                { validator: this.checkCategory}
              ],
            })(
              <Select style={{ width: 120 }} >
                <Option key="请选择">请选择</Option>
                {categoryOptions}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"

          >
            {getFieldDecorator('description', { initialValue: '' ,
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
        <Modal title="操作结果" visible={this.state.showAddModel}
          onOk={this.handleOk} onCancel={this.handleCancel}
          okText="返回列表" cancelText="继续添加"
        >
          <p>添加成功!</p>
        </Modal>
      </div>
    )
  }
}
export default ExamForm = Form.create()(ExamForm);
