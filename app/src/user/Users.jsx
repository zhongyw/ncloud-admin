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

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        var that = this;

        this.state = {
            sortedInfo: null,
            filteredInfo: null,
            loading: true,
            freezeUserModelVisible: false,
            freezeDays: 1,
            curUserId: "",
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

    freezeUser = (id, locked_until) => {
        locked_until = typeof(locked_until) == 'undefined' ?  this.state.freezeDays : locked_until;
        fetch(apiRoot + '/api/users/' + id + '/lock', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': generateAuthorization(constants.role.ADMIN)
            },
            body: JSON.stringify({locked_until: locked_until})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            message.success(locked_until === 0 ? '解冻成功': '冻结成功');
            this.fetchTableData();
        });

    }

    handleCancel = () => {
        this.setState({showModel: false});
    }

    addCategory = (event) => {
        hashHistory.push("/addCategory");
    }
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({filteredInfo: filters, sortedInfo: sorter});
    }
    freezeSelected = (ids, locked_until) => {
        locked_until = typeof(locked_until) === 'undefined' ? this.state.freezeDays : locked_until;
        fetch(apiRoot + '/api/users/lock/selected', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': generateAuthorization(constants.role.ADMIN)
            },
            body: JSON.stringify({ids: ids, locked_until: locked_until})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            message.success(locked_until === 0 ? '解冻成功': '冻结成功');
            this.setState({selectedRowKeys: []});
            this.fetchTableData();
        });
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    }

    fetchTableData = (postData) => {
        postData = Object.assign({}, {
            page: this.state.pagination.current,
            size: this.state.pagination.pageSize
        }, postData);
        var esc = encodeURIComponent;
        var query = Object.keys(postData).map(k => esc(k) + '=' + esc(postData[k])).join('&');
        fetch(apiRoot + '/api/users?' + query, {
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
            this.setState({tData: data.users, loading: false});
            this.setState({
                pagination: pagerAdaptor.getPagerFromRemote(this.state.pagination, data.page)
            });
        });

    }

    componentDidMount() {
        this.fetchTableData();
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
        console.log('hasSelected=' + hasSelected);
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
                title: 'email',
                dataIndex: 'email'
            },  {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text, record) => {
                  return dateHelper.toDate(text);
                }
            }, {
                title: '状态',
                dataIndex: 'locked_until',
                render: (text, record) => {
                  return text > 0 ? <span style={{color:'red'}}>已冻结:{record.locked_until}天</span>: <span style={{color:'green'}}>正常</span>;
                }
            },{
                title: '操作',
                dataIndex: 'handle',
                render: (text, record, index) => (
                    <span>

                        <span style={record.locked_until === 0 ? {display: 'inline-block'} : {display: 'none'}}>
                          <Tooltip title='冻结'>
                              <Link  onClick={
                                ()=>{this.setState({freezeUserModelVisible: true, curUserId: record.id})}}>
                                <i className='fa fa-lock'/>
                              </Link>
                          </Tooltip>&nbsp;&nbsp;
                        </span>
                        <span style={record.locked_until > 0 ? {display: 'inline-block'} : {display: 'none'}}>
                          <Tooltip title='解冻'>
                              <Link  onClick={
                                ()=>{this.freezeUser(record.id, 0)}
                              }>
                                <i className='fa fa-unlock'/>
                              </Link>
                          </Tooltip>&nbsp;&nbsp;
                        </span>
                    </span>
                )
            }
        ];
        return (
            <div id="wrap">

                <div style={{
                    marginBottom: 16
                }}>


                    冻结时长: <Select
                      style={{ width: 100 }}
                      placeholder="请选择"
                      defaultValue={this.state.freezeDays}
                      optionFilterProp="children"
                      onChange={(value)=>{this.setState({freezeDays: parseInt(value)})}}
                      notFoundContent=""
                    >
                      <Option value="1">1 天</Option>
                      <Option value="2">2 天</Option>
                      <Option value="3">3 天</Option>
                      <Option value="7">1 星期</Option>
                      <Option value="14">2 星期</Option>
                      <Option value="30">1 月</Option>
                      <Option value="60">2 月</Option>
                      <Option value="90">3 月</Option>
                      <Option value="180">6 月</Option>
                      <Option value="365">1 年</Option>
                      <Option value="40000">永远</Option>
                    </Select>

                    <Popconfirm title="确认要冻结已选中项吗?" onConfirm={() => this.freezeSelected(selectedRowKeys)} onCancel={() => {}} okText="确定" cancelText="取消">
                        <Button type="primary" style={{
                            marginLeft: 10
                        }} disabled={!hasSelected} loading={loading}>批量冻结</Button>
                    </Popconfirm>
                    <Popconfirm title="确认要解冻已选中项吗?" onConfirm={() => this.freezeSelected(selectedRowKeys, 0)} onCancel={() => {}} okText="确定" cancelText="取消">
                        <Button type="primary" style={{
                            marginLeft: 10
                        }} disabled={!hasSelected} loading={loading}>批量解冻</Button>
                    </Popconfirm>
                    <span style={{
                        marginLeft: 8
                    }}>{hasSelected
                            ? `选中 ${selectedRowKeys.length} 项`
                            : ''}</span>

                </div>
                <div id="table">
                    <Table rowKey={record => record.id} rowSelection={rowSelection} dataSource={this.state.tData} columns={columns} size="middle" pagination={this.state.pagination} onRowClick={this.rowClick} onChange={this.handleChange} />
                </div>
                <Modal title="冻结用户" visible={this.state.freezeUserModelVisible}
                  onOk={
                    ()=>{this.freezeUser(this.state.curUserId, this.state.freezeDays); this.setState({freezeUserModelVisible: false})
                    }
                  } onCancel={()=>{this.setState({freezeUserModelVisible: false})}}
                >
                  <p>
                    冻结时长: <Select
                      style={{ width: 200 }}
                      placeholder="请选择"
                      defaultValue={this.state.freezeDays}
                      optionFilterProp="children"
                      onChange={(value)=>{this.setState({freezeDays: parseInt(value)})}}
                      notFoundContent=""
                    >
                      <Option value="1">1 天</Option>
                      <Option value="2">2 天</Option>
                      <Option value="3">3 天</Option>
                      <Option value="7">1 星期</Option>
                      <Option value="14">2 星期</Option>
                      <Option value="30">1 月</Option>
                      <Option value="60">2 月</Option>
                      <Option value="90">3 月</Option>
                      <Option value="180">6 月</Option>
                      <Option value="365">1 年</Option>
                      <Option value="40000">永远</Option>
                    </Select>
                  </p>
                </Modal>
            </div>
        )
    }
}
