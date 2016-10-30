import React from 'react';

import CategoryForm from './CategoryForm.jsx';


export default class EditCategory extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <CategoryForm type="edit" categoryId={this.props.params.id}/>
      </div>
    )
  }
}
