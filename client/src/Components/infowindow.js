import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './infowindow.css';


export default class InfoWindow extends React.Component {
 

handleOnSubmit(lat, lng){
var url = new URL("https://www.google.com/maps/dir/?api=1&"); // ++destination=-30,150
var latLng = lat + ',' + lng
console.log("latLng")
console.log(latLng)
url.searchParams.append('destination', latLng);
console.log("url")
console.log(url)
window.open(url, '_blank');
}
  render() {
  return (
    <div className="black">
        <p > Ahoj </p>
         <Button bsStyle="success" onClick={this.handleOnSubmit.bind(this, this.props.lat, this.props.lng)} >Navigate me there!</Button>
    </div>
  );
  }
}
