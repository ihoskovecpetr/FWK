import React, { Component } from 'react';
import {Grid, Row, Col, Button, Tabs, Tab, Glyphicon} from 'react-bootstrap'
import _ from 'lodash';
import axios from 'axios';

import './admin.css'

 var idcko = [];
 var counter = 1;
 var INC = 0.5;

export default class Admin extends Component {

  constructor(props, context) {
    super(props, context);
    this.callback = this.callback.bind(this);
    this.callbackGlobal = this.callbackGlobal.bind(this);
    this.myRef = React.createRef();
    // this.callback2 = this.callback2.bind(this);
    // this.repeat = this.repeat.bind(this);
    this.state = {

      VenuesGooglePlaces: [],
      topLeftState: '',
      bottomRightState: '',
      
    };
  }


//Google MAPS Places - API 

loadAgainGooglePlaces(e){
  console.log("loadAgain FCE pred GooglePlaces")
  console.log(e)
  e.preventDefault();
  this.getVenuesGooglePlaces( document.getElementById('searchShop').value, document.getElementById('setPrice').value, document.getElementById('NrOfResults').value) // calling foursquare API
 // this.showAway() // just show all points from DB with 0.8$ price
}

getVenuesGooglePlaces(place, shop, price, NrOfResults){

  console.log("getVenues jdu na API Google Places")
console.log("window")
console.log(window)


        this.initMap()

  }


initMap(){
        console.log("fce initMap")
        var center = new window.google.maps.LatLng(this.props.ClickedPositionGoogle[0], this.props.ClickedPositionGoogle[1]);
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 8
        });

        var Query = document.getElementById('searchShop').value

        var request = {  location: center, query: Query, rankby: "distance" }  //distance: 10000 --> ignorace rankby parametr..

        var service = new window.google.maps.places.PlacesService(map);

        service.textSearch(request, this.callback)

        
        
         }

callback(result, status){
                  console.log("result HERE")
                  console.log(result)
                  console.log(this)
       
                 this.props.bringGooglePlacesData(result)
                
              }

callbackGlobal(result, status,){
    console.log("result HERE")
    console.log(result)
    console.log("status")
    console.log(status)
    var e = document.getElementById("setBrand")
  console.log('setBrand')
  console.log(e.options[e.selectedIndex].value)


   this.props.bringGooglePlacesDataGLOBAL(result, document.getElementById('setPrice').value, e.options[e.selectedIndex].value)
  
}

handleAddManny(){
   var e = document.getElementById("setBrand")
  console.log('setBrand')
  console.log(e.options[e.selectedIndex].value)
  this.props.handleAddManny(document.getElementById('setPrice').value, e.options[e.selectedIndex].value)
}



globalScan(){

  console.log("GLOBAL SCAN")
//whole AUS
//   var latit = -10.1944;
// var Maxatit = -42.488;

// var lngit = 110.6119;
// var Maxlngit = 152.90;


var latit = this.state.topLeftState[0];
var Maxatit = this.state.bottomRightState[0];

var lngit = this.state.topLeftState[1];
var Maxlngit = this.state.bottomRightState[1];

//var INC = this.myRef.current.value;

var Slat;
var Slng;

 var center = new window.google.maps.LatLng(latit, lngit);
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 10
        });

        var Query = document.getElementById('searchShop').value

        //var request = {  location: center, query: Query, rankby: "distance" }  //distance: 10000 --> ignorace rankby parametr..

        var service = new window.google.maps.places.PlacesService(map);


console.log("INCREMENT " + INC)

 var refreshIntervalId = setInterval( ()=>{ 
if (latit > Maxatit) {
  var request = {  location: {lat: latit ,lng: lngit } , query: Query, rankby: "distance" }
  service.textSearch(request, this.callbackGlobal)
  latit = latit - INC
  console.log("latit", latit , "lngit", lngit)
  console.log('COUNTER ++++++++++++ -> ', counter );
  counter++
} else{
  console.log(" KONEC ROW KONEC ROW KONEC ROW KONEC ROW KONEC ROW KONEC ROW")
  lngit = lngit + INC
  latit = this.state.topLeftState[0]

  if (lngit > Maxlngit) {
    console.log("GAME OVER GAME OVER GAME OVER GAME OVER GAME OVER GAME OVER GAME OVER GAME OVER ")
  clearInterval(refreshIntervalId)
  }
}

 } , 500);

}

topLeft(){
  this.setState({topLeftState: this.props.ClickedPositionGoogle})
}

bottomRight(){
  console.log("Bottom CORNER")
  console.log(window.google)
  console.log(this)
  this.setState({bottomRightState: this.props.ClickedPositionGoogle})
}

  render() {
    console.log("Ahoj z render v Admin - props")
    console.log(this.props)

    return (
      <div id='adminWindow' >

            <Tabs
        activeKey={this.state.key}
        onSelect={this.handleSelect}
        id="controlled-tab-example"
      >
       

    <Tab eventKey={1} title="Google maps Places API">
      <Grid id="gridAdmin">
      
         <Row className="row-oneB">
              <Col xs={12} md={12} > 
                  <p>SCAN the World!!!</p>
              </Col>
        </Row>
        <Row>
 
               <Col xs={6} md={2} > 
                  <p>id="searchShop"</p>
                  <input type="text" name="shop" id="searchShop" />
              </Col>

              <Col xs={6} md={2} > 
                 <p>id="setPrice"</p>
                 <input type="number" name="number" id="setPrice" />
              </Col>
              <Col xs={6} md={2} > 
                 <p>id="NrOfResults"</p>
                 <input type="number" name="number" id="NrOfResults" />
              </Col>
              <Col xs={6} md={2} > 
                 <p>id="setBrand"</p>
                 <select name="cars" id="setBrand">
  <option value="7-eleven">7-eleven</option>
  <option value="Coles Express">Coles Express</option>
  <option value="Caltex Woolworths">Caltex Woolworths</option>
  <option value="Foodary">Foodary</option>
</select>
              </Col>
              <Col xs={12} md={4} > 
                  <Button bsStyle="primary" id="button" className="button" onClick={this.loadAgainGooglePlaces.bind(this)} >Search Google API</Button>
                  <Button bsStyle="success" id="button" className="button" onClick={this.handleAddManny.bind(this)} >Add them All</Button>
                  <Button bsStyle="info" id="button" className="button" onClick={this.globalScan.bind(this)} >Start scanning</Button>
              </Col>
        </Row>
        <div id="black">
        <p>Boundaries for google maps PLACES API</p>
        </div>
        <Row>
        <Col xs={4} md={4}>
        <div className="scrollDiv">
        <p>Clicked location</p>
          <p>{this.props.ClickedPositionGoogle[0]}</p>
          <p>{this.props.ClickedPositionGoogle[1]}</p>
        </div>
        </Col>
                <Col xs={4} md={4}>
        <Button bsStyle="info" id="button" className="button" onClick={this.topLeft.bind(this)} >Assign ->> Left Top corner </Button>

          <p>{this.state.topLeftState[0] ? this.state.topLeftState[0] : '0'}</p>
          <p>{this.state.topLeftState[1] ? this.state.topLeftState[1] : '0'}</p>
        
        </Col>
                <Col xs={4} md={4}>
                <Button bsStyle="success" id="button" className="button" onClick={this.bottomRight.bind(this)} >Assign ->> Right Bottom corner</Button>
  
          <p>{this.state.bottomRightState[0] ? this.state.bottomRightState[0] : "0"}</p>
          <p>{this.state.bottomRightState[1] ? this.state.bottomRightState[1] : "0"}</p>
          
        </Col>
         <Col xs={4} md={4}>
               <p>Predicted Number of rounds</p>
          <p>{((this.state.topLeftState[0]-this.state.bottomRightState[0])/INC * (this.state.topLeftState[1]-this.state.bottomRightState[1])/INC)*(-1)}</p>
          
        </Col>
        </Row>

      </Grid>
    </Tab>

      </Tabs>
     
       </div>
    );
  }
}


