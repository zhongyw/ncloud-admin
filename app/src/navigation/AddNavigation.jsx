import React from 'react';

import NavigationForm from './NavigationForm.jsx';


export default class AddNavigation extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <NavigationForm type="add"/>
      </div>
    )
  }
}
