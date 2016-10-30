import React from 'react';

import {Select, Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal,message} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NavigationForm extends React.Component{
  constructor(props){
      super(props);

      this.state = {
          visible : false,
          showAddModel: false,
          parentNavs: []
      }
  }

  goBack = (event) => {
    hashHistory.push('/navigations');
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
  adaptBody = (fieldsObj) => {
    if(fieldsObj.parent_id === '请选择') fieldsObj.parent_id = '';
    return fieldsObj;
  }
  submitEdit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      // console.log('Received values of form:', this.props.form.getFieldsValue());
      fetch(apiRoot + '/api/navigations/' + this.props.navigationId,
      {
            method: 'post', mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
            },
            body: JSON.stringify(this.adaptBody(this.props.form.getFieldsValue()))
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
      fetch(apiRoot + '/api/navigations',
      {
            method: 'post', mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
            },
            body: JSON.stringify(this.adaptBody(this.props.form.getFieldsValue()))
      }).then((res) => {
        return res.json();
      }).then((data) => {
        this.setState({showAddModel: true});
        // this.goBack();
      })
    });
  }
  fetchEditData = () => {
    fetch(apiRoot + '/api/navigations/' + this.props.navigationId,
    {
          method: 'get', mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': generateAuthorization(constants.role.ADMIN)
          }
    }).then((res) => {
      return res.json();
    }).then((data) => {
        this.props.form.setFieldsValue({
          name: data.name,
          parent_id: data.parent_id,
          url: data.url
        });
    })
  }
  getParentIds = () => {
    fetch(apiRoot + '/api/navigations',
    {
          method: 'get', mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': generateAuthorization(constants.role.ADMIN)
          }
    }).then((res) => {
      return res.json();
    }).then((data) => {
      this.setState({parentNavs: data.navigations});
      // this.goBack();
    })
  }
  componentDidMount(){
    this.getParentIds();
    if(this.props.type === 'edit'){
      this.fetchEditData();
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const parentNavOptions = this.state.parentNavs.map(nav => <Option key={nav.id}>{nav.name}</Option>);
    return (
      <div>
        <Button type="primary" onClick={this.goBack} icon="rollback">返回</Button>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('name', { initialValue: '',
              rules: [
                { required: true, min: 5, message: '名称不能少于五个字符' },
              ],
            })(
              <Input type="text" placeholder="请输入名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="父类"

          >
            {getFieldDecorator('parent_id', { initialValue: '请选择'
              })(
                <Select style={{ width: 120 }} >
                  <Option key="请选择">请选择</Option>
                  {parentNavOptions}
                </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="url"
          >
            {getFieldDecorator('url', { initialValue: '', rules: [
              { required: true, min: 5, message: 'url不能少于五个字符' },
            ]
              })(
                <Input type="text" placeholder="请输入url" />
            )}
          </FormItem>

          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="ghost"  onClick={this.handleReset} style={{marginLeft:10}}>重置</Button>
          </FormItem>
        </Form>
        <Modal title="操作结果" visible={this.state.showAddModel}
          onOk={()=>{this.setState({showAddModel: false});this.goBack();}}
          onCancel={()=>{this.setState({showAddModel: false}); this.handleReset();}}
          okText="返回列表" cancelText="继续添加"
        >
          <p>添加成功!</p>
        </Modal>

      </div>
    )
  }
}
export default NavigationForm = Form.create()(NavigationForm);
