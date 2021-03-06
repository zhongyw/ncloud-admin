import React from 'react';

import {Modal,Table,Icon,Tooltip, Button, Row, Col, Popconfirm, message} from 'antd';
import { Link,hashHistory } from 'react-router';
// import fetchMock from 'fetch-mock';
import {apiRoot, pagerAdaptor,constants, generateAuthorization} from '../common/commonHelper.js'

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';


export default class Navigations extends React.Component {
    constructor(props) {
        super(props);
        var that = this;

        this.state = {
            sortedInfo: null,
            filteredInfo: null,
            loading: true,
            showModel: false,
            selectedRowKeys: [],

            tData: []
        }
    }

    handleOk = (id) => {

      fetch(apiRoot + '/api/navigations/' + id + '/delete', {
          method: 'post',
          mode: 'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
          }
      }).then((res) => {
          return res.json();
      }).then((data) => {
          message.success('删除成功');
          this.fetchTableData();
      });

    }

    handleCancel = () => {
      this.setState({
        showModel: false,
      });
    }

    addNavigation = (event) => {
        hashHistory.push("/addNavigation");
    }
    handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    }
    handleDeleteSelected = (ids) => {
      fetch(apiRoot + '/api/categories/delete/selected', {
          method: 'post',
          mode: 'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': generateAuthorization(constants.role.ADMIN)
          },
          body: JSON.stringify({ids: ids})
      }).then((res) => {
          return res.json();
      }).then((data) => {
          message.success('删除成功');
          this.setState({selectedRowKeys: []});
          this.fetchTableData();
      });
    }
    onSelectChange = (selectedRowKeys) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    }

    updateSort = () => {
      // var data = this.state.tData,
      //     ids = [];
      // for(var i = 0; i < data.length; i++){
      //     ids.push(data[i].id);
      // }
      // fetch(apiRoot + '/api/categories/all/sort', {
      //     method: 'post',
      //     mode: 'cors',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json',
      //         'Authorization': generateAuthorization(constants.role.ADMIN)
      //     },
      //     body: JSON.stringify({ids: ids})
      // }).then((res) => {
      //     return res.json();
      // }).then((data) => {
      //     message.success('排序已更新');
      // });
    }

    sortUp = (id) => {

        var data = this.state.tData;
        for(var i = 0; i < data.length; i++){
          if(data[i].id === id){
            if(i === 0) break;
            let temp = data[i-1];
            data[i-1] = data[i];
            data[i] = temp;
          }
        }
        this.setState({tData: data});
        this.updateSort();
    }
    sortDown = (id) => {
      console.log(id);
      var data = this.state.tData;

      for(var i = 0; i < data.length; i++){
        if(data[i].id === id){
          if(i === data.length-1) break;
          let temp = data[i+1];
          data[i+1] = data[i];
          data[i] = temp;
        }
      }
      this.setState({tData: data});
      this.updateSort();
    }

    fetchTableData = (postData) => {

        var esc = encodeURIComponent;
        fetch(apiRoot + '/api/navigations', {
            method: 'get',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': generateAuthorization(constants.role.ADMIN)
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({tData: data.navigations, loading: false});
            this.setState({
                pagination: pagerAdaptor.getPagerFromRemote(this.state.pagination, data.page)
            });
        });

    }

    componentDidMount() {
        this.fetchTableData();
    }

    render() {
        const { loading, selectedRowKeys } = this.state;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;
        console.log('hasSelected=' + hasSelected);
        /*定义表格列*/
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                filters: [
                  { text: 'asdfasdf', value: 'asdfasdf' },
                  { text: 'Jim', value: 'Jim' },
                ],
                filteredValue: filteredInfo.name,
                onFilter: (value, record) =>    record.name.includes(value),
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            }, {
                title: 'url',
                dataIndex: 'url'
            }, {
                title: '操作',
                dataIndex: 'handle',
                render: (text, record, index) => (
                    <span>
                        <Tooltip title="往上">
                          <Link onClick={()=>this.sortUp(record.id)}><i className="fa fa-arrow-up"/></Link>
                        </Tooltip>&nbsp;&nbsp;
                        <Tooltip  title="往下">
                          <Link onClick={()=>this.sortDown(record.id)}><i className="fa fa-arrow-down"/></Link>
                        </Tooltip>&nbsp;&nbsp;
                        <Tooltip title="修改">
                            <Link to={"/editNavigation/"+ record.id}><i className="fa fa-pencil"/></Link>
                        </Tooltip>&nbsp;&nbsp;
                        <Popconfirm title="确认要删除此项吗?" onConfirm={()=>this.handleOk(record.id)} onCancel={()=>{}} okText="确定" cancelText="取消">
                          <a href="#"><i className="fa fa-trash" style={{color: '#FD5B5B'}}/></a>
                        </Popconfirm>

                    </span>
                )
            }
        ];
        return (
            <div id="wrap">

                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={this.addNavigation} icon="plus">添加</Button>
                  <Popconfirm title="确认要删除此项吗?" onConfirm={()=>this.handleDeleteSelected(selectedRowKeys)} onCancel={()=>{}} okText="确定" cancelText="取消">
                    <Button type="primary" style={{ marginLeft: 10 }}
                      disabled={!hasSelected} loading={loading}
                    >批量删除</Button>
                  </Popconfirm>

                  <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                </div>
                <div id="table">
                    <Table rowKey={record => record.id} rowSelection={rowSelection} dataSource={this.state.tData} columns={columns} size="middle"  onRowClick={this.rowClick}
                    onChange={this.handleChange} />
                </div>

            </div>
        )
    }
}
