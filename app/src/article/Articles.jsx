import React from 'react';

import {
    Modal,
    Table,
    Icon,
    Tooltip,
    Button,
    Select,
    Row,
    Col,
    Popconfirm,
    message
} from 'antd';
import {Link, hashHistory} from 'react-router';
// import fetchMock from 'fetch-mock';
import {apiRoot, pagerAdaptor, constants, dateHelper, generateAuthorization} from '../common/commonHelper.js'

const Option = Select.Option;

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';

export default class Articles extends React.Component {
    constructor(props) {
        super(props);
        var that = this;

        this.state = {
            sortedInfo: null,
            filteredInfo: null,
            loading: true,
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

    fetchTableData = (postData) => {
        postData = Object.assign({}, {
            page: this.state.pagination.current,
            size: this.state.pagination.pageSize
        }, postData);
        var esc = encodeURIComponent;
        var query = Object.keys(postData).map(k => esc(k) + '=' + esc(postData[k])).join('&');
        fetch(apiRoot + '/api/articles?' + query, {
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
            this.setState({tData: data.articles, loading: false});
            this.setState({
                pagination: pagerAdaptor.getPagerFromRemote(this.state.pagination, data.page)
            });
        });

    }

    componentDidMount() {
        this.fetchTableData();
    }

    deleteArticle( id ) {
      fetch(apiRoot + '/api/articles/' + id + '/delete', {
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

    handleDeleteSelected = (ids) => {
      fetch(apiRoot + '/api/articles/delete/selected', {
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

    render() {
        const {loading, selectedRowKeys} = this.state;
        let {sortedInfo, filteredInfo} = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const hasSelected = selectedRowKeys.length > 0;
        /*定义表格列*/
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                filters: [
                    {
                        text: 'asdfasdf',
                        value: 'asdfasdf'
                    }, {
                        text: 'Jim',
                        value: 'Jim'
                    }
                ],
                filteredValue: filteredInfo.name,
                onFilter: (value, record) => record.name.includes(value),
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
            }, {
                title: '用户',
                dataIndex: 'user_name'
            },  {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text, record) => {
                  return dateHelper.toDate(text);
                }
            },{
                title: '操作',
                dataIndex: 'handle',
                render: (text, record, index) => (
                  <span>
                      <Tooltip title="编辑"><Link to={"/editArticle/" + record.id}><i className="fa fa-pencil" /></Link></Tooltip>&nbsp;&nbsp;
                      <Tooltip title="删除"><Link onClick={ e => {this.deleteArticle(record.id)} }><i className="fa fa-trash" style={{color:'#FD5B5B'}}/></Link></Tooltip>
                  </span>
                )
            }
        ];
        return (
            <div id="wrap">

                <div style={{
                    marginBottom: 16
                }}>
                  <Link to="/addArticle">
                    <Button type="primary" onClick={this.addArticle} icon="plus" >添加</Button>
                  </Link>

                  <Popconfirm title="确认要删除此项吗?" onConfirm={()=>this.handleDeleteSelected(selectedRowKeys)} onCancel={()=>{}} okText="确定" cancelText="取消">
                    <Button type="primary" style={{ marginLeft: 10 }}
                      disabled={!hasSelected} loading={loading}
                    >批量删除</Button>
                  </Popconfirm>

                  <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                </div>
                <div id="table">
                    <Table rowKey={record => record.id} rowSelection={rowSelection} dataSource={this.state.tData} columns={columns} size="middle" pagination={this.state.pagination} onRowClick={this.rowClick} onChange={this.handleChange} />
                </div>

            </div>
        )
    }
}
