import React from 'react';

import ArticleForm from './ArticleForm.jsx';


export default class AddArticle extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <ArticleForm type="add" articleId={this.props.params.id}/>
      </div>
    )
  }
}
