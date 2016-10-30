import React from 'react';

import CategoryForm from './CategoryForm.jsx';


export default class AddCategory extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <CategoryForm type="add"/>
      </div>
    )
  }
}
