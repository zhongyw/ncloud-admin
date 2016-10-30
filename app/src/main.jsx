import React from 'react';
import ReactDOM from 'react-dom';

// 引入垫片兼容IE
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect,IndexLink} from 'react-router';

// 引入Antd组件
import { Menu, Icon, Breadcrumb, Row, Col } from 'antd';
const SubMenu = Menu.SubMenu;

// 引入单个页面（包括嵌套的子页面）
import Welcome from './welcome/welcome.jsx';
import Exams from './exam/exams.jsx';
import Users from './user/Users.jsx';
import Articles from './article/Articles.jsx';
import AddArticle from './article/AddArticle.jsx';
import EditArticle from './article/EditArticle.jsx';
import AddExam from './exam/addExam.jsx'
import Categories from './category/Categories.jsx'
import AddCategory from './category/AddCategory.jsx'
import EditCategory from './category/EditCategory.jsx'
import Navigations from './navigation/Navigations.jsx'
import AddNavigation from './navigation/AddNavigation.jsx'
import EditNavigation from './navigation/EditNavigation.jsx'

// 引入Ant-Design样式 & Animate.CSS样式 & font-awesome样式
import 'antd/dist/antd.min.css';
import 'animate.css/animate.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'draft-js/dist/Draft.css';
// 引入主体样式
import './main.less';

// 配置整体组件
class Init extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '1',
            openKeys: []
        };

    }
    handleClick = (e) => {
      console.log('click ', e);
      this.setState({
        current: e.key,
      });
    }


    render() {
        return (
            <div>
                <h1>Hello World</h1>
                <div id="leftMenu">
                    <div style={{textAlign:'center', padding:5, verticalAlign:'middle', display: 'inline-block'}}>
                      <Icon type="cloud" style={{fontSize: 40, verticalAlign: 'middle'}}/>
                      <label style={{verticalAlign: 'middle', fontSize: '18'}}> 控制台</label>
                    </div>  {/*logo图标*/}

                    <Menu onClick={this.handleClick}
                        style={{ width: 146 }}
                        defaultOpenKeys={['问答']}
                        selectedKeys={[this.state.current]}
                        theme="light"
                        mode="inline">
                        <Menu.Item key="1">
                            <IndexLink to="/"><span><Icon type="home" /><span>首页</span></span></IndexLink>
                        </Menu.Item>
                        <SubMenu key="导航" title={<span><Icon type="book" /><span>导航</span></span>}>
                            <Menu.Item key="Navigations"><Link to="/navigations/">导航列表</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="分类" title={<span><Icon type="book" /><span>分类</span></span>}>
                            <Menu.Item key="Categories"><Link to="/categories/">分类列表</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="文章" title={<span><Icon type="file-text" /><span>文章</span></span>}>
                            <Menu.Item key="Articles"><Link to="/articles/">文章列表</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="用户" title={<span><Icon type="user" /><span>用户</span></span>}>
                            <Menu.Item key="Users"><Link to="/users/">用户列表</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="问答" title={<span><Icon type="question-circle" /><span>问答</span></span>}>
                            <Menu.Item key="Exams"><Link to="/exams/">问答列表</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div id="rightWrap">
                    <Row type="flex" justify="start" align="middle" style={{'padding-bottom': '5px'}}>
                        <Col><Icon type="home" style={{'margin-right': '3px'}}></Icon></Col>
                        <Col><Breadcrumb {...this.props}/></Col>
                    </Row>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
// 配置路由，并将路由注入到id为init的DOM元素中
ReactDOM.render((
    <Router history={hashHistory} >
        <Route path="/" breadcrumbName="首页" icon="link" component={Init}>
            <IndexRoute component={Welcome}/>
            <Route path="navigations" component={Navigations} breadcrumbName="导航"/>
            <Route path="addNavigation" component={AddNavigation} breadcrumbName="添加导航"/>
            <Route path="editNavigation/:id" component={EditNavigation} breadcrumbName="修改导航"/>
            <Route path="categories" component={Categories} breadcrumbName="分类"/>
            <Route path="addCategory" component={AddCategory} breadcrumbName="添加分类"/>
            <Route path="editCategory/:id" component={EditCategory} breadcrumbName="修改分类"/>

            <Route path="users" component={Users} breadcrumbName="用户"/>
            <Route path="articles" component={Articles} breadcrumbName="文章"/>
            <Route path="addArticle" component={AddArticle} breadcrumbName="添加文章"/>
            <Route path="editArticle/:id" component={EditArticle} breadcrumbName="修改文章"/>
            <Route path="exams" component={Exams} breadcrumbName="问答"/>
            <Route path="addexam" component={AddExam} breadcrumbName="添加问答"/>

        </Route>
    </Router>
), document.querySelector('#init'))
