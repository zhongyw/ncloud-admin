import React from 'react';

import {Button,Select,Upload, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal,message} from 'antd';
import { MarkdownEditor } from 'react-markdown-editor';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'

const FormItem = Form.Item,
      RadioGroup = Radio.Group,
      Option = Select.Option;

class ArticleForm extends React.Component{
  constructor(props){
      super(props);

      this.state = {
          visible : false,
          showAddModel: false,
          categories: []
      }
  }

  goBack = (event) => {
    hashHistory.push('/articles');
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
      fetch(apiRoot + '/api/articles/' + this.props.articleId,
      {
            method: 'post', mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
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
      console.log('Received values of form:', this.props.form.getFieldsValue());

      fetch(apiRoot + '/api/articles',
      {
            method: 'post', mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
            },
            body: JSON.stringify(this.props.form.getFieldsValue())
      }).then((res) => {
        return res.json();
      }).then((data) => {
        this.setState({showAddModel: true});
        // this.goBack();
      })
    });
  }
  fetchEditData = () => {
    fetch(apiRoot + '/api/articles/' + this.props.articleId,
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
          category_id: data.category_id,
          tags: data.tags,
          description: data.description,
          content: data.content
        });
        this.refs.mdEditor.setState({'content': data.content});
    })
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

  componentDidMount(){
    this.getCategories();
    if(this.props.type === 'edit'){
      this.fetchEditData();
    }
  }
  processFile(file, callback) {
    if (file.type!=='image/jpeg' && file.type!=='image/png') {
        alert('File is not a valid image!');
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var
            data = e.target.result,
            index = data.indexOf(';base64,');
        if ((index >= 0) && (index < 100)) {
            callback({
                image: data,
                data: data.substring(index + 8)
            });
        }
    };
    reader.readAsDataURL(file);
  }
  fileChange = e => {
    var that = this;
    this.processFile(e.target.files[0], function(r){
      //console.log(r.data);
      that.props.form.setFieldsValue({'image': r.data})
      //that.setState({image: r.data});
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          },
          categoryOptions = this.state.categories.map(category => <Option key={category.id}>{category.name}</Option>);
    const uploadProps = {
      name: 'file',
      action: '/upload.do',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div>
        <Button type="primary" onClick={this.goBack} icon="rollback">返回</Button>
        <Form horizontal onSubmit={this.handleSubmit}>
          {getFieldDecorator('image', { initialValue: '123'})(
            <Input type="hidden"  />
          )}
          {getFieldDecorator('content', { initialValue: ''
            })(
                <Input type="hidden" />
          )}
          <FormItem
            {...formItemLayout}
            label="封面"
          >
              <input type="file" onChange={this.fileChange}/>
          </FormItem>
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
            label="标签"

          >
            {getFieldDecorator('tags', { initialValue: '' ,
                rules: [
                  { required: true, min: 5, message: '标签不能少于五个字符' },
                ],
              })(
              <Input type="textarea" placeholder="请输入标签" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"

          >
            {getFieldDecorator('description', { initialValue: '' ,
                rules: [
                  { required: true},
                ],
              })(
              <Input type="textarea" placeholder="请输入描述" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="内容"
          >
            <MarkdownEditor ref="mdEditor" onContentChange={ (_content) => this.props.form.setFieldsValue({'content': _content}) } initialContent="" iconsSet="font-awesome"/>
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
export default ArticleForm = Form.create()(ArticleForm);
