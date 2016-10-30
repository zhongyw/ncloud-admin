import React from 'react';

import NavigationForm from './NavigationForm.jsx';


export default class EditNavigation extends React.Component{
  constructor(props){
      super(props);
  }
  render(){
    return (
      <div id="wrap">
        <NavigationForm type="edit" navigationId={this.props.params.id}/>
      </div>
    )
  }
}
