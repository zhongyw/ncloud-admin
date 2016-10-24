import React from 'react';

import {Modal,Table,Icon,Tooltip, Button, Row, Col, Popconfirm, message} from 'antd';
import { Link,hashHistory } from 'react-router';
// import fetchMock from 'fetch-mock';
import {apiRoot, pagerAdaptor,constants, generateAuthorization} from '../common/commonHelper.js'

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';


export default class Categories extends React.Component {
    constructor(props) {
        super(props);
        var that = this;

        this.state = {
            sortedInfo: null,
            filteredInfo: null,
            loading: true,
            showModel: false,
            selectedRowKeys: [],
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
            tData: []
        }
    }

    handleOk = (id) => {

      fetch(apiRoot + '/api/categories/' + id + '/delete', {
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

    addCategory = (event) => {
        hashHistory.push("/addCategory");
    }
    handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    }
    handleDeleteSelected = (e) => {

    }
    onSelectChange = (selectedRowKeys) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    }
    fetchTableData = (postData) => {
        postData = Object.assign({}, {
            page: this.state.pagination.current,
            size: this.state.pagination.pageSize
        }, postData);
        var esc = encodeURIComponent;
        var query = Object.keys(postData).map(k => esc(k) + '=' + esc(postData[k])).join('&');
        fetch(apiRoot + '/api/categories?' + query, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({tData: data.categories, loading: false});
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
                title: '标签',
                dataIndex: 'tag'
            }, {
                title: '操作',
                dataIndex: 'handle',
                render: (text, record, index) => (
                    <span>
                        <Tooltip title="Lost">
                            <Link to={"/editCategory/"+ record.id}><i className="fa fa-pencil"/></Link>
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
                  <Button type="primary" onClick={this.addCategory} icon="plus">添加</Button>
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={this.handleDeleteSelected}
                    disabled={!hasSelected} loading={loading}
                  >批量删除</Button>
                  <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                </div>
                <div id="table">
                    <Table rowKey={record => record.id} rowSelection={rowSelection} dataSource={this.state.tData} columns={columns} size="middle" pagination={this.state.pagination} onRowClick={this.rowClick}
                    onChange={this.handleChange} loading={this.state.loading}/>
                </div>

            </div>
        )
    }
}
