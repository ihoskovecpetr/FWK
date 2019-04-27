import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Button, Nav, Navbar, NavItem, Image, Alert, Jumbotron, FormGroup, form, ControlLabel, FormControl, FieldGroup, Glyphicon } from 'react-bootstrap'
import axios from 'axios';
import GeolocationMarker from 'geolocation-marker';
import _ from 'lodash';

import './App.css';

import Admin from './Components/admin';
import Mrk1 from './img/grey-pin1.svg';
import Mrk2 from './img/grey-pin2.svg';
import Mrk3 from './img/grey-pin3.svg';
import Fwk from './img/fwk.png';


export default class App extends Component {
    constructor(props) {
    super(props);
    this.renderAwaySorted = this.renderAwaySorted.bind(this);
    this.Add = this.Add.bind(this);
    this.fetchDBfce = this.fetchDBfce.bind(this);
    this.state = {
      venues: [],
      displVenues: [],
      ClickedPosition: '',
      ClickedPositionGoogle: '',
      workingPrice: '', // Price choosen for rendering
      venuesDB: [],
            }
  }

  componentDidMount(){

   window.initMap = this.initMap

      
           this.renderAwaySorted()
           console.log("componentDidMount end")


//this.fetchDBfce()


}

fetchDBfce(){
        fetch('/dbVenueId', { method: 'get', mode: 'no-cors',  headers: {
                 Accept: 'application/json',
         'Content-Type': 'application/json',
                  }, })
        .then(res => res.json())
        .then(coffee => {
          console.log("Fetch -- == -- coffee DB1")
          this.setState({venuesDB: coffee}, () =>{
       
           // this.showAway()  // displaying map on the backgroung with atribute undefined as a choosen price
          })})
}


showAway(value, bool){

  console.log("showAway FCE")


_.map(this.state.venues, (one, index) => {


console.log("one")
console.log(one.name)
console.log(one)
//console.log(one.photos[0].getUrl({'maxWidth': 900, 'maxHeight': 600}))
//console.log(one.getUrl({maxHeight: 300}))

    var displayedVenues = [];

      if (displayedVenues !== []) {
                  this.setState({displVenues: displayedVenues }, function(){
                this.renderAwaySorted()
            })
      }

});

}


// render location sorted wawy into display

renderAwaySorted(){

console.log('renderAwaySorted HEREEEE')


var LandL;

if (this.state.ClickedPositionGoogle == '') {
 LandL = [-35.5 , 145.6918];
} else{
  LandL = this.state.ClickedPositionGoogle
}


var Zoom = 5;
var here = this;

  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: LandL[0], lng: LandL[1]},
    zoom: Zoom,
    disableDefaultUI: true,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    clickableIcons: false,
    gestureHandling: "greedy", 
     styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ],
  });

    var opt = { minZoom: 3, maxZoom: 15 };
    map.setOptions(opt);


        map.addListener('click', function(event){

          here.setState({ClickedPositionGoogle: [event.latLng.lat(), event.latLng.lng()]})
        })

    if (this.state.venues) {

      var infowindow = new window.google.maps.InfoWindow()

          _.map(this.state.venues, (one, index) => {


          var marker = new window.google.maps.Marker({
              position: one.geometry.location,
              map: map,
              title: "Title",
            }) 

          var contentString = `<div id="infowind">
                           XXX man${one.name}

                             </div>`

        

          marker.addListener('click' , function(){
            infowindow.setContent(contentString)
            infowindow.open(map, marker);
          })

          })
    }
 

var GeoMarker = new window.GeolocationMarker(map);


 window.google.maps.event.addListener(map, 'idle', function() {
  console.log("Maapa IDL__E___E___E")
                  var bounds =  map.getBounds();
                  var ne = bounds.getNorthEast();
                  var sw = bounds.getSouthWest();
                  //do whatever you want with those bounds
                  console.log('bounds', bounds)
                  console.log(JSON.stringify(bounds))
                  console.log('neeeee', ne.lng() , ne.lat())
                  console.log(JSON.stringify(ne))
                  console.log('sw', sw)
                  console.log(JSON.stringify(sw))
         })

 
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
      

    })
  })
}


handleAddManny( price, brand){

  this.state.venues.map(myPoint =>{
    console.log("Add Manny points each")
    console.log(myPoint)
    console.log("Photo URL")
    var photoSource = '0';
    if (myPoint.photos) {
      photoSource = myPoint.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})
      console.log(myPoint.photos[0].getUrl({'maxWidth': 900, 'maxHeight': 600}))
    }
    console.log(myPoint.name)
    console.log(myPoint.geometry.location.lat())
    console.log(myPoint.geometry.location.lng())
    console.log(price)
    console.log([{address: myPoint.formatted_address}])
    console.log(myPoint.types[0])
    console.log(myPoint.place_id)
   this.Add( myPoint.name , myPoint.geometry.location.lat() , myPoint.geometry.location.lng() , price , [{address: myPoint.formatted_address}], myPoint.types[0] , myPoint.place_id, photoSource, brand )
  })
}




Add(name, lng, lat, price, info, categorie, venueId, photos, brand){
  console.log("Add fce z App.js + photoSource - ", photos)

    fetch('/add/points', {
          method: 'POST',
          mode: "same-origin",
          headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
                  },
          body: JSON.stringify({name: name, lng: lng , lat: lat, price: price, info: info, categorie: categorie, venueId: venueId, photos: photos, brand: brand}),
            })
  }  


//loadig the location of the user rigth away when the app open's and is rendered for a first time





bringGooglePlacesData(VenuesGooglePlaces){
  console.log("Jsem v app.js bring Google places API back")
  console.log(VenuesGooglePlaces)
  this.setState({venues: VenuesGooglePlaces}, () => {this.showAway()})


         }

    bringGooglePlacesDataGLOBAL(VenuesGooglePlaces, price, brand){
    console.log("Jsem v app.js bring Google GLOBAL")
    console.log(VenuesGooglePlaces)
    this.setState({venues: VenuesGooglePlaces}, () => {this.showAway(); this.handleAddManny(price, brand)})


    }




  render() {


console.log("First Rendering whole document")
console.log("window.google")
console.log(window.google)

var x = new window.google.maps.LatLng(-34.397, 150.644)
var y = new window.google.maps.LatLng(-34.397, 150.646)

var distance = window.google.maps.geometry.spherical.computeDistanceBetween(x,y)

console.log("distance")
console.log(distance)
    
    return (
      <div className="Main">



<header className="Header" id="Header">
      <div id="map"></div>


     <Admin 
            bringGooglePlacesData={this.bringGooglePlacesData.bind(this)}
            bringGooglePlacesDataGLOBAL={this.bringGooglePlacesDataGLOBAL.bind(this)}
            handleAddManny={this.handleAddManny.bind(this)}
            venuesDB={this.state.venuesDB}
            ClickedPositionGoogle={this.state.ClickedPositionGoogle}
            venuesDB={this.state.venuesDB}
             />
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

