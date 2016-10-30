import React from 'react';

import {Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import {apiRoot, constants, generateAuthorization} from '../common/commonHelper.js'
import ExamForm from './examForm.jsx';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class AddExam extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <ExamForm type="add"/>
      </div>
    )
  }
}
