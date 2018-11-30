import React, { Component } from 'react';
import {Grid, Row, Col, Button, Nav, Navbar, NavItem, Image, Alert, Jumbotron, FormGroup, form, ControlLabel, FormControl, FieldGroup } from 'react-bootstrap'
import axios from 'axios';
import GeolocationMarker from 'geolocation-marker';
import _ from 'lodash';
import ReactDOM from 'react-dom';

import './App.css';
import Detail from './Components/detail';
import Admin from './Components/admin';
import NewVenue from './Components/new-input-window';
import InfoWindow from './Components/infowindow';



export default class App extends Component {
    constructor(props) {
    super(props);
    this.state = {
      venues: [],
      venuesDB: [],
      displVenues: [],
      workingLocation: [],
      ClickedPosition: [],
      workingZoom: '',  // Not using right now (problem with re-rendering)
      workingVenue: '', // Venue on which is clicked right now, othervise empty
      workingPrice: '', // Price choosen for rendering
      unConfirmedArray: [], // Array of locations which are waiting to be admitted
      toBeDeletedArray: [], // Array of locations which are waiting to be deleted
      adminOpen: '',
      adminKey: 1,
      navExpand: false,

      }
  }

  componentDidMount(){
    this.poloha()  //find out opsition and put this location into workingLocation
   window.initMap = this.initMap

   console.log("componentDidMount start")
      
      fetch('/db', { method: 'get', mode: 'no-cors',  headers: {
                 Accept: 'application/json',
         'Content-Type': 'application/json',
                  }, })
        .then(res => res.json())
        .then(coffee => {
          console.log("Fetch -- == -- coffee")
          this.setState({venuesDB: coffee}, () =>{
            document.getElementById("buttons").classList.remove("hideIt");
            this.showAway()  // displaying map on the backgroung with atribute undefined as a choosen price
          })})  
           console.log("componentDidMount end")
}


showAway(value, bool){

    if (value) {
     this.setState({workingPrice: value, adminOpen: false})  // to keep reference of working Price for re-rendering map close adminOpen reference
    }
   
    if (value == undefined) {
      value = this.state.workingPrice;
    }


  document.getElementById("adminWindow").classList.add("hideIt");
  document.getElementById("detailWindow").classList.add("hideIt");
  document.getElementById("newInput").classList.add("hideIt"); 

  if (bool) { //Moving away with Jumbo first page
    document.getElementById("jumbo").classList.add("move");
    document.getElementById("inform").classList.remove("hideIt");
    document.getElementById("NavBar").classList.remove("hideIt");
    document.getElementById("currentLocation").classList.remove("hideIt");
    
  }

//Taking out all the unconfirmed arrays

var helperArray = [];
var helperArrayDeleted = [];

    _.map(this.state.venuesDB.docs, (one, index) => {

if (one.confirmed == false) {
  helperArray.push(one)
}

if (one.toBeDeleted == true) {
  helperArrayDeleted.push(one)
}
  } )

  this.setState({unConfirmedArray: helperArray})
  this.setState({toBeDeletedArray: helperArrayDeleted})


// Sort which coffee's should be shown

    var displayedVenues = [];

  if (value == 0.8 || value == undefined) {
    console.log("zero is true")


    this.state.venuesDB.docs.map(venue => {
      
      if (venue.price == 0.8) {
        if (venue.confirmed == true || venue.confirmed == undefined) {
                  displayedVenues.push(venue)
        }
      }
    })


  }  if (value == 1) {
    console.log("one is true")

        this.state.venuesDB.docs.map(venue => {
      
      if (venue.price == 1 || venue.price == 0.8) {
          if (venue.confirmed == true || venue.confirmed == undefined) {
                  displayedVenues.push(venue)
        }
      }
    })


  }   if (value == 2) {
    console.log("two is true")

    this.state.venuesDB.docs.map(venue => {
      
      if (venue.price == 2 || venue.price == 1 || venue.price == 0.8) {
       if (venue.confirmed == true || venue.confirmed == undefined) {
                  displayedVenues.push(venue)
        }
      }
    })

      }

      this.setState({displVenues: displayedVenues }, function(){
          this.renderAwaySorted()
      })
}

statusPrint(){
return(<p> Ahoj </p>)
}


// render location sorted wawy into display

renderAwaySorted(){

var LandL;
var Zoom;
if (this.state.workingLocation == '' ) {
  LandL = [-33.8690 , 151.2018];
  Zoom = 13

} else { 
  LandL = [ this.state.workingLocation[0], this.state.workingLocation[1] ];
  Zoom = 13;
}


  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: LandL[0], lng: LandL[1]},
    zoom: Zoom,
    disableDefaultUI: true,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    clickableIcons: false,
    gestureHandling: "cooperative", 
  });


var GeoMarker = new window.GeolocationMarker(map);

var bounds = new window.google.maps.LatLngBounds()

if (this.state.adminOpen == true && this.state.adminKey == 1) {

    console.log("Unconfirmed Arr")
    _.map(this.state.unConfirmedArray, (one, index) => {
        bounds.extend( new window.google.maps.LatLng(one.lat,one.lng) );
    })

  map.fitBounds(bounds, {top:100, bottom:200,right:100, left:100})
} 

if (this.state.adminOpen == true && this.state.adminKey == 2) {

      console.log("toBeDeleted Arr")
      _.map(this.state.toBeDeletedArray, (one, index) => {
          bounds.extend( new window.google.maps.LatLng(one.lat,one.lng) );
    })
  map.fitBounds(bounds, {top:100, bottom:200,right:100, left:100})
}





  var infowindow = new window.google.maps.InfoWindow()

  var markers = this.state.displVenues.map(myVenue =>{

    var contentString = `<div id="infowind">
                            <div id="cup-coffee">
                              <img src="https://img.icons8.com/color/26/000000/coffee-to-go.png" height="100%"/>
                            </div>Name: <b>${myVenue.name}</b> 
                            </br>Price of coffee: <b>${myVenue.price} $</b>
                            </br>To be Deleted: <b>${myVenue.toBeDeleted}</b> 
                             </div>` + '<div id="infoWindow" />'

// </br>Distance: <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194"> Seznam </a>    

          switch(myVenue.price) {
              case 0.8:
                  var url = "https://img.icons8.com/material-outlined/26/000000/marker.png"
                  break;
              case 1:
                   var url = "https://img.icons8.com/material-two-tone/26/000000/marker.png"
                  break;
              case 2:
                   var url = "https://img.icons8.com/material-rounded/26/000000/marker.png"
                   break;
              }


        var image = {
        url: url,
        size: new window.google.maps.Size(24, 24),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(12, 24)
      };

  var marker = new window.google.maps.Marker({
      position: {lat: myVenue.lat,
                 lng: myVenue.lng},
      map: map,
      icon: image,
      title: myVenue.name,
    })

  //print only Markers with status confirmed





   // Listener on the Location marker
    var here = this
    marker.addListener('click', function() {

      console.log("Marker posloucha na tenhle addListener")

      if (previousMarker) {
        document.getElementById("newInput").classList.add("hideIt");  //unmounting table of adding new Marker
        previousMarker.setMap(null);      // unmounting Marker of adding new Marker
        previousMarker = undefined;       // unmounting Marker of adding new Marker
       } else{

      infowindow.setContent(contentString)

      infowindow.addListener('domready', e => {
      ReactDOM.render(<InfoWindow />, document.getElementById('infoWindow'))
    })
      infowindow.open(map, marker);

      here.setState({workingVenue: myVenue}, function(){document.getElementById("detailWindow").classList.remove("hideIt");})
       }  

    })

    map.addListener('click', function(event) {
        infowindow.close();

    })
  
})

  /* // API ----- API
console.log("API VenueSSSSSSSSSŠSSSSSSSSSSSSSSSSSSSSSSS")
console.log(this.state.venues)

//Print of venues from foursQ API
          this.state.venues.map(myVenue =>{

          console.log("RENDRUJU Venues (API)")

    var contentString = `${myVenue.venue.name}` + '<br>' + `${myVenue.venue.location.address}`

    var marker = new window.google.maps.Marker({
      position: {lat: myVenue.venue.location.lat,
                 lng: myVenue.venue.location.lng},
      map: map,
      title: myVenue.name,
    })
    marker.addListener('click', function() {
      infowindow.setContent(contentString)
      infowindow.open(map, marker);
    })
  })  */

var previousMarker;
var here = this;


  map.addListener('click', function(event) { 


    if (here.state.adminOpen) {
     // document.getElementById("adminWindow").classList.add("hideIt"); // close the admin window on click on map
      //here.setState({adminOpen: false})
    } else {

      if (here.state.navExpand) { //close the expanded NavBar on click on map
        var prevStaveExp = here.state.navExpand
        here.setState({navExpand: !prevStaveExp})
      } else{
           
        if (here.state.workingVenue) {   //close the detail window on click on map
           document.getElementById("detailWindow").classList.add("hideIt");
           here.setState({workingVenue: ''})
        } else{

          if (previousMarker){  //close the last new location marker and window on click on map
                previousMarker.setMap(null);
                previousMarker = undefined;
                document.getElementById("newInput").classList.add("hideIt");
          } else{
      
      document.getElementById("newInput").classList.remove("hideIt");
      
      here.setState({ClickedPosition: [event.latLng.lat(), event.latLng.lng()]})

          previousMarker = new window.google.maps.Marker({
          position: event.latLng,
          map: map,
          label: '+',
          title: "myVenue.name",
        })
          }
        }         
      }      
    }
  });


  map.addListener('center_changed', function(event) {
    // Performance issue (unnecessary re-rendering of whole map, look on it later)
     // here.setState({workingLat: map.getCenter().lat(), workingLng: map.getCenter().lng(), workingZoom: map.getZoom()})
      console.log("CHanged wiew of screen XXXXxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  })
}




// render MAP for a first time while search for a places from Foursquare API
loadAgain(event){
  event.preventDefault();
    document.getElementById("jumbo").classList.add("move");
    document.getElementById("inform").classList.remove("hideIt");
    document.getElementById("NavBar").classList.remove("hideIt");
  this.getVenues(document.getElementById('searchPlace').value) // calling foursquare API
  this.showAway() // just show all points from DB with 0.8$ price
}

getVenues(near){

  const endpoint = 'https://api.foursquare.com/v2/venues/explore?'
  const parameters = {
      client_id: 'PPIUJVIDIRE512E2FZQE2U04ONIIABQ45E2TXB3Z42SGNJCL' ,
      client_secret: '4DQL4XDUCGWKFCOJSZS0O31T0HOHSXQL01L0OTKJV2BDOBOE' ,
      query: near,
      intent: 'browse',
      ll: this.state.workingLocation,
      v: '20181106',
      radius: 40000,
      alt: 0,
      limit: 100,

  }
  axios.get(endpoint + new URLSearchParams(parameters))
    .then(response => {
      console.log(response)
      this.setState({
          venues: response.data.response.groups[0].items
         }, () => {console.log("Calluju back")} )
    })
    .catch(error => {
      console.log("Error - " + error)
    })

  }



renderMap(){
  console.log("Map has been rendered again")
  loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDgJ8PXMCjCJgtEjBu1gCSxLGaUoq7kW6c&callback=initMap")
  window.initMap = this.initMap
  }


initMap(){

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

onSubmit(){
    document.getElementById("newInput").classList.add("hideIt");
    console.log(document.getElementById('inputName').value);
    console.log(document.getElementById('inputPrice').value);


    fetch('/add-custom-point', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({lng: this.state.ClickedPosition[0], lat: this.state.ClickedPosition[1] , name:  document.getElementById('inputName').value , price: document.getElementById('inputPrice').value, confirmed: false }),
            }).then(this.componentDidMount())

  }

Update(_id){

    fetch('/acknowleadge-point', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({_id: _id}),
            }).then(this.componentDidMount()).then(this.showAdmin())
  }

Delete(_id){
    fetch('/delete-point', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({_id: _id}),
            }).then(this.componentDidMount())
  }

markItDelete(_id){
      fetch('/mark-delete-point', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({_id: _id}),
            }).then(this.componentDidMount())
  }



  onClose(){
    document.getElementById("newInput").classList.add("hideIt");
  }

//loadig the location of the user rigth away when the app open's and is rendered for a first time

  poloha(){
        if (navigator.geolocation) {
          console.log("Geolocation is supported");
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));

    } else { 
       console.log("Geolocation is not supported by this browser.");
    }
}

  showPosition(position){
      this.setState(
  { workingLocation: [position.coords.latitude, position.coords.longitude ] },
  () => {
    console.log("Current GPS gained and writen info WorkingLocation -------------------------")
    this.showAway()
  //    this.renderMap()
  } // this callback renders coffees on the map
);
      
    }

showAdmin(){
        document.getElementById("adminWindow").classList.remove("hideIt");
        document.getElementById("detailWindow").classList.add("hideIt");
        document.getElementById("newInput").classList.add("hideIt");
        this.setState({navExpand: false})
         this.setState({adminOpen: true})
        //onShowADMIN CHANGES sorted Venues to be displayed and set to render them then
        if (this.state.adminKey == 1) {
          this.setState({displVenues: this.state.unConfirmedArray }, function(){
          this.renderAwaySorted()  
        })
        } else{
          this.setState({displVenues: this.state.toBeDeletedArray }, function(){
          this.renderAwaySorted()  
        })
        }
}

setNavExpanded(){
  console.log("chci tagglovat NAvBar")
  var pastStateExp = this.state.navExpand 
  this.setState({navExpand: !pastStateExp})
  document.getElementById("adminWindow").classList.add("hideIt");
  document.getElementById("detailWindow").classList.add("hideIt");
  document.getElementById("newInput").classList.add("hideIt");

}

changeCenter(){
  console.log("change location on me")
  this.renderAwaySorted()
}

passKeyFromAdmin(key){
  this.setState({adminKey: key}, () => {this.showAdmin()})
}



  render() {
const navbar = { backgroundColor: 'transparent' };

console.log("rendering whole document again")
    
    return (
      <div className="Head">

<Navbar fixedTop inverse collapseOnSelect 
      id="NavBar" className="hideIt" 
      expanded={this.state.navExpand} onToggle={this.setNavExpanded.bind(this)}  >
    <Navbar.Toggle />
  <Navbar.Collapse>
    <Nav pullLeft>
    <NavItem>
    <Button bsStyle="info" id="Nav-button" onClick={this.showAway.bind(this, 0.8, true)}> 0.8 $ </Button>
    </NavItem>
    <NavItem>
    <Button bsStyle="info" id="Nav-button" onClick={this.showAway.bind(this, 1, true)}> 1 $ </Button>
    </NavItem>
    <NavItem>
    <Button bsStyle="info" id="Nav-button" onClick={this.showAway.bind(this, 2, true)}> 2 $ </Button>
    </NavItem>
    </Nav>

    <Nav pullRight>
      <NavItem>
      <Button bsStyle="info" id="Nav-button" className="admin" onClick={this.showAdmin.bind(this)}>Develop</Button>
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
       <div id='jumbo-cup1' className="jumbo-cup animated bounceInDown" onClick={this.showAway.bind(this, 0.8, true)}>
       <p>0.8 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
    </Col>
    <Col xs={12} md={4} id="col" > 
       <div id='jumbo-cup2' className="jumbo-cup animated bounceInUp" onClick={this.showAway.bind(this, 1, true)}>
       <p>1 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
    </Col>
    <Col xs={12} md={4} id="col" > 
       <div id='jumbo-cup3' className="jumbo-cup animated bounceInDown" onClick={this.showAway.bind(this, 2, true)}>
       <p>2 $ coffee</p> 
        <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
       </div>
      </Col>
    </Row>
   </Grid>

<div className="hideIt">
/* hiddent now, used just for development purposes  */

     <Button bsStyle="primary" id="button" className="button" onClick={this.loadAgain.bind(this, 'Sydney')} >Search location Canb - shithole</Button>           
        <form id="formJumbo">
          <label>
            What kind of place are you looking for:
            <input type="text" name="place" id="searchPlace" />
          </label>
        <label>
            Price:
            <input type="number" name="number" id="searchPrice" />
          </label>
          <input type="submit" value="Submit" onClick={this.loadAgain.bind(this)} />
        </form>
</div>
    </div>
  </Jumbotron>

<header className="Headless-header">
      <div id="map"></div>
     <Detail  venue={this.state.workingVenue} 
              fceDelete={this.Delete.bind(this)} 
              markItDelete={this.markItDelete.bind(this)} />

     <Admin unconfirmed={this.state.unConfirmedArray} 
            toBeDeleted={this.state.toBeDeletedArray} 
            update={this.Update.bind(this)} 
            delete={this.Delete.bind(this)} 
            passKeyFromAdmin={this.passKeyFromAdmin.bind(this)} />

      <NewVenue onSubmit={this.onSubmit.bind(this)} 
                onClose={this.onClose.bind(this)} />
    
      <div id="inform" className="hideIt" >
        <div id="img-div" onClick={this.showAway.bind(this, 0.8)} ><p>0.8 $</p><Image src="https://img.icons8.com/material-outlined/48/000000/marker.png" /></div>
        <div id="img-div" onClick={this.showAway.bind(this, 1)} ><p>1 $</p><Image src="https://img.icons8.com/material-two-tone/48/000000/marker.png" /></div>
        <div id="img-div" onClick={this.showAway.bind(this, 2)} ><p>2 $</p><Image src="https://img.icons8.com/material-rounded/48/000000/marker.png" /></div>
      </div>

      <div id="currentLocation" className="hideIt" onClick={this.changeCenter.bind(this)}>
         <Image src="https://img.icons8.com/windows/32/000000/location-off.png" />
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


window.onscroll = function() {myFunction()};

function myFunction() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        //document.getElementById("myImg").className = "slideUp";
        console.log('Scrolled 200px')
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

