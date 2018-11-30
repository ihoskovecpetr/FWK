import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './infowindow.css';


export default class InfoWindow extends React.Component {
 

handleOnSubmit(){
console.log("Ahoj Funguje to")
}
  render() {
  return (
    <div className="black">
        <p > Ahoj </p>
         <Button bsStyle="success" onClick={this.handleOnSubmit.bind(this)} >Submit</Button>
    </div>
  );
  }
}
