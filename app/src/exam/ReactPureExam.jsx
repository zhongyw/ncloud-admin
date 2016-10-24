import React from 'react';

import {Button, Row, Col, Form, Input, Checkbox, Radio, Tooltip, Icon, Modal} from 'antd';
// 引入标准Fetch及IE兼容依赖
import {fetch} from 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';


export default class ReactPureExam extends React.Component{
  constructor(props){
      super(props);
      this.state = {
        username: '111'
      };
      console.log('-=-------------b');
      console.log(fetch);
      fetch('http://myapp.iriscouch.com/users/1',
        {
              method: 'get', mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        }).then((res) => {
          return res.json();
        }).then((data) => {
          console.log(data);
          this.setState({username: data.username});
        });
  }
  render(){
    return (
      <div id="wrap" ref="wrapd">
        {this.state.username}
      </div>
    )
  }
}
