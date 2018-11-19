import React, { Component } from 'react';
import {Grid, Row, Col, Button, Nav, Navbar, NavItem, Image, Alert, Jumbotron, FormGroup, form, ControlLabel, FormControl, FieldGroup } from 'react-bootstrap'
import axios from 'axios';
import GeolocationMarker from 'geolocation-marker';
import './App.css';
import CanvasComponent from './Canv';
import CurrentMarker from './current-marker.svg';




export default class App extends Component {
    constructor(props) {
    super(props);
        this.state = {
      venues: [],
      venuesDB: [],
      venuesWorking: [],
      workingLocation: [],
      workingLocation: [],
      }
  }

  componentDidMount(){
   window.initMap = this.initMap
      

            document.getElementById("buttons").classList.remove("hideIt");
            document.getElementById("NavBar").classList.remove("hideIt"); 
}




// render location regarding to price custommer choose.

renderAwaySorted(){

      document.getElementById("jumbo").classList.add("move");
    document.getElementById("inform").classList.remove("hideIt");

  this.setState({venuesWorking: []})  //emptying this.state is so quict that we dont need to treat it as a asynch function and await finishing before executing rendering.

var LandL;
if (this.state.workingLocation[0] == undefined ) {
  LandL = [-33.90 , 151.20]
} else { 
  LandL = [ this.state.workingLocation[0], this.state.workingLocation[1] ] 
}

  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: LandL[0], lng: LandL[1]},
    zoom: 13,
    disableDefaultUI: true,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
  });


    var infowindow = new window.google.maps.InfoWindow()



    var contentString = `<div id="infowind">
                            <div id="cup-coffee">
                              <img src="https://img.icons8.com/color/26/000000/coffee-to-go.png" height="100%"/>
                            </div>Name: Nada chickita
                            </br>Distance: 10 km
                            <a src='maps://maps.google.com/maps?daddr=-34.397,150.644&amp;ll=' > Link </a>
                            <Link to='maps://maps.google.com/maps?daddr=-34.397,150.644&amp;ll='>Link</Link>
                            <Button href='https://www.youtube.com/watch?v=MEzcDiA6shM'>Link</Button>
                          </div>`


    var url = "https://img.icons8.com/material-outlined/26/000000/marker.png"

    var image = {
    url: url,
    size: new window.google.maps.Size(24, 24),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(12, 24)
  };

    var marker = new window.google.maps.Marker({
      position: {lat: -33.90,
                 lng: 151.2},
      map: map,
     // icon: <CurrentMarker />,

      title: "title",
    })
    marker.addListener('click', function() {
      infowindow.setContent(contentString)
      infowindow.open(map, marker);
    })
console.log("window");
console.log(window);
var GeoMarker = new window.GeolocationMarker(map);


//Current position marker   

var location = {
    url: 'https://img.icons8.com/office/40/000000/circled-dot.png',
    size: new window.google.maps.Size(40, 40),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(20, 20)
  };

var meMarker = new window.google.maps.Marker({
      position: {lat: this.state.workingLocation[0],
                 lng: this.state.workingLocation[1]},
      icon: location,
      map: map,
      title: "Your current location",
    })
infowindow.setContent("You are here")
infowindow.open(map, meMarker);



var previousMarker;
var here = this;
  map.addListener('click', function(event) {
          //map.setZoom(11);
          console.log("event.latLng")
          console.log(event.latLng)
          document.getElementById("newInput").classList.remove("hideInput");

        if (previousMarker){
              previousMarker.setMap(null);
              previousMarker = undefined;
              document.getElementById("newInput").classList.add("hideInput");
        } else{
        console.log("event.latLng.lng()")
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
      here.setState({workingLocation: [event.latLng.lat(), event.latLng.lng()]})

      var contentString = `Add information about this place.` 
      previousMarker = new window.google.maps.Marker({
      position: event.latLng,
      map: map,
      label: '+',
      title: "myVenue.name",
    })
      infowindow.setContent(contentString)
      previousMarker.addListener('click', function() {
      infowindow.open(map, previousMarker);
    })
      infowindow.open(map, previousMarker);
          }
  });
}



// render MAP for a first time



renderMap = () => {
  console.log("renderMap() initial fce")
  loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDgJ8PXMCjCJgtEjBu1gCSxLGaUoq7kW6c&callback=initMap")
  window.initMap = this.initMap
  }


initMap = () => {

  console.log("initMap() initial fce")
  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 5
  });
   var infowindow = new window.google.maps.InfoWindow()

  console.log("this.state.venues")
  console.log(this.state.venues)

        this.state.venues.map(myVenue =>{

          console.log("RENDRUJU Venues (API)")

    var contentString = `${myVenue.name}`

    var marker = new window.google.maps.Marker({
      position: {lat: myVenue.lat,
                 lng: myVenue.lng},
      map: map,
      title: myVenue.name,
    })
    marker.addListener('click', function() {
      infowindow.setContent(contentString)
      infowindow.open(map, marker);
    })
  })
}

handleShow(){

  console.log("SHOW STATE")
  console.log(this.state)
  
 /*   var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: this.state.venues[0].venue.location.lat , lng: this.state.venues[0].venue.location.lng},
    zoom: 10
  });
   var infowindow = new window.google.maps.InfoWindow()


        this.state.venues.map(myVenue =>{


    var contentString = `Name: ${myVenue.venue.name} </br>Distance from you: ${Math.round(myVenue.venue.location.distance/100)/10} km`

    var marker = new window.google.maps.Marker({
      position: {lat: myVenue.venue.location.lat,
                 lng: myVenue.venue.location.lng},
      map: map,
      title: myVenue.venue.name,
    })
    marker.addListener('click', function() {
      infowindow.setContent(contentString)
      infowindow.open(map, marker);
    })
  }) */
}


handleAdd(){
  console.log("this.state");
  console.log(this.state);
  this.state.venues.map(myPoint =>{
    this.Add( myPoint.venue.name , myPoint.venue.location.lat , myPoint.venue.location.lng , "er")
  })
}

Add(name, lng, lat, info){
  console.log("Add fce")

    fetch('/add/points', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({name: name, lng: lng , lat: lat, info: info, price: document.getElementById('searchPrice').value }),
            })
  }

  round2decimals(x){
        var y = (Math.round(x*1000))/1000
      return(
        <span>{y}</span>
        )
  }
//
    onSubmit(e){
    e.preventDefault();
    document.getElementById("newInput").classList.add("hideInput");
    console.log(document.getElementById('inputName').value);
    console.log(document.getElementById('inputPrice').value);


    fetch('/add-custom-point', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({lng: this.state.workingLocation[0], lat: this.state.workingLocation[1] , name:  document.getElementById('inputName').value , price: document.getElementById('inputPrice').value }),
            }).then(this.componentDidMount())

  }

  onClose(e){
    e.preventDefault();
    document.getElementById("newInput").classList.add("hideInput");
  }

//loadig the location of the user rigth away when the app open's and is rendered for a first time

  poloha(){

        if (navigator.geolocation) {
          console.log("Geo")
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));

    } else { 
       console.log("Geolocation is not supported by this browser.");
    }
}

  showPosition(position){
      console.log("Latitude: " + position.coords.latitude + 
      "Longitude: " + position.coords.longitude )
      
      this.setState(
  { workingLocation: [position.coords.latitude, position.coords.longitude ] },
  () => {console.log("It has been writen to the state - This is real Callback!!")
      this.renderMap()
  } // this callback renders coffees on the map
);
      
    }

  render() {
const navbar = {backgroundColor: 'transparent', color: 'white'};
const text = {color: 'white'};

this.poloha()
    
    return (
      <div className="Head">

<Navbar staticTop inverse collapseOnSelect style={navbar} id="NavBar" className="hideIt"  >
    <Navbar.Toggle />
  <Navbar.Collapse>
    <Nav pullLeft>
    <NavItem>
    <Button bsStyle="info" id="Nav-button" onClick={this.renderAwaySorted.bind(this, 2, true)}> 2 $ </Button>
    </NavItem>
    </Nav>

  </Navbar.Collapse>


</Navbar>

    <Jumbotron id="jumbo" >
    <span></span>
      <div id="buttons" className="hideIt"  >


   <Grid id="jumbo-cups" >
    <Row>
    <Col xs={12} md={4} id="col"> 
       <div id='jumbo-cup' onClick={this.renderAwaySorted.bind(this, 0.8, true)}>
       <p>0.8 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
    </Col>
    <Col xs={12} md={4} id="col" > 
       <div id='jumbo-cup' onClick={this.renderAwaySorted.bind(this, 1, true)}>
       <p>1 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
    </Col>
    <Col xs={12} md={4} id="col" > 
       <div id='jumbo-cup' onClick={this.renderAwaySorted.bind(this, 2, true)}>
       <p>2 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
    </Col>
    </Row>
   </Grid>

<div className="hideIt">
/* hiddent now, used just for development purposes  */

</div>
    </div>
  </Jumbotron>


  <header className="Headless-header">
  <CanvasComponent />
      <div id="map"></div>
      <form id="newInput" className="hideInput" >
      <div id="new-place-header"><p>Insert details for a new place</p></div>
          <Grid id="grid">
            <Row className="show-grid">

              <FormGroup>
                  <Col xs={12} md={4} >
                     <ControlLabel><p>Name of this place:</p></ControlLabel>
                  </Col>
                  <Col xs={12} md={8}>
                   <FormControl placeholder="Best coffee Gatton" type="text" id="inputName" />
                  </Col>

              </FormGroup>
            </Row>
            <Row>
             <FormGroup>
                <Col xs={12} md={4} >
                  <ControlLabel><p>Select</p></ControlLabel>
                </Col>
                <Col xs={12} md={8}>
                  <FormControl componentClass="select" placeholder="select" id="inputPrice">
                  <option value="0.8" >0.8$</option>
                  <option value="1" >1$</option>
                  <option value='2' >2$</option>
                </FormControl>
                </Col>
            </FormGroup>
          </Row>
          <Row>
                 <Button bsStyle="info" className="button" type="submit" onClick={this.onSubmit.bind(this)} >Submit</Button>
               <Button bsStyle="danger" className="button" type="close" onClick={this.onClose.bind(this)} >Close</Button>
          </Row>
        </Grid>
      </form>
    
      <div id="inform" className="hideIt" >
        <div id="img-div" ><p>0.8 $</p><Image src="https://img.icons8.com/material-rounded/26/000000/marker.png" width='24px' height='24px' /></div>
        <div id="img-div" ><p>1 $</p><Image src="https://img.icons8.com/material-two-tone/26/000000/marker.png" width='24px' height='24px' /></div>
        <div><p>2 $</p><Image src="https://img.icons8.com/material-outlined/26/000000/marker.png" width='24px' height='24px' /></div>
      </div>
<div className="hideIt">
      <Button bsStyle="danger" id="saveBtn" onClick={this.handleAdd.bind(this)} > Save </Button>
      <Button bsStyle="danger" onClick={this.handleShow.bind(this)} > Show state </Button>
</div>
  </header>
      </div>
    );
  }
}

function loadScript(url){
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement('script')
  script.scr = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index) 
}

