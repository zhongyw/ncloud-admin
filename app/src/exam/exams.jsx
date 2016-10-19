import React from 'react';

import {Table,Icon,Tooltip, Button, Row, Col} from 'antd';
import { Link,hashHistory } from 'react-router';
// import fetchMock from 'fetch-mock';

import {apiRoot, pagerAdaptor} from '../common/commonHelper.js'

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';

/*彩色动感标题组件*/
export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        var that = this;
        this.state = {
          loading: true,
          pagination: {
              total: 100,
              showSizeChanger: true,
              size: 'large',
              current: 1,
              defaultCurrent: 1,
              pageSize: 10,
              showTotal: total => `总记录数: ${total}`,
              onShowSizeChange(current, pageSize) {
                  console.log('Current: ', current, '; PageSize: ', pageSize);
                  that.state.pagination.current = current;
                  that.state.pagination.pageSize = pageSize;
                  that.fetchTableData();
              },
              onChange(current) {

                  console.log('Current: ', current);
                  console.log(that.state.pagination);
                  that.state.pagination.current = current;
                  console.log(that.state.pagination);
                  that.fetchTableData();
              }
          },
          tData : []
        }
    }
    addExam = (event) => {
      hashHistory.push("/addexam");
    }
    fetchTableData = (postData) => {
      postData = Object.assign({},
                  {
                    page: this.state.pagination.current,
                    size: this.state.pagination.pageSize
                  }, postData);
      var esc = encodeURIComponent;
      var query = Object.keys(postData)
          .map(k => esc(k) + '=' + esc(postData[k]))
          .join('&');
      fetch(apiRoot + '/api/exams?' + query,
        {
              method: 'get', mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        }).then((res) => {
          return res.json();
        }).then((data) => {
          this.setState({tData: data.exams, loading: false});
          this.setState({pagination: pagerAdaptor.getPagerFromRemote(this.state.pagination, data.page)});
        });


    }

    componentDidMount(){
      this.fetchTableData();
    }

    render() {
      /*定义表格列*/
      const columns = [{
            title: '问题',
            dataIndex: 'title'
        }, {
            title: '答案',
            dataIndex: 'answer'
        },{
            title: '操作',
            dataIndex: 'handle',
            render:
                (t,r,i) => (
                    <span>
                        <Tooltip title="Lost"><Link to={"/device/edit/"+(i+1)}><i className="fa fa-pencil" /></Link></Tooltip>&nbsp;&nbsp;
                        <Tooltip title="Delete"><i className="fa fa-trash" style={{color:'#FD5B5B'}}/></Tooltip>
                    </span>
                )
        }];
        return (
          <div id="wrap">
              <Button type="primary" onClick={this.addExam} icon="plus" style={{marginBottom: 5}}>添加</Button>
              <div id="table">
                  <Table
                      rowSelection={{}}
                      dataSource={this.state.tData}
                      columns={columns}
                      size="middle"
                      pagination={this.state.pagination}
                      onRowClick={this.rowClick}
                      loading={this.state.loading}
                  />
              </div>
          </div>
        )
    }
}
