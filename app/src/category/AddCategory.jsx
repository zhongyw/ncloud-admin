import React from 'react';

import {Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'
import CategoryForm from './CategoryForm.jsx';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class AddCategory extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <CategoryForm type="add"/>
      </div>
    )
  }
}
