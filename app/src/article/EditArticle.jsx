import React from 'react';

import ArticleForm from './ArticleForm.jsx';


export default class EditArticle extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <ArticleForm type="edit" articleId={this.props.params.id}/>
      </div>
    )
  }
}
