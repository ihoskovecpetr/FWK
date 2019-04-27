import React, { Component } from 'react';
import {Grid, Row, Col, Button, Nav, Navbar, NavItem, Image, Alert, Jumbotron, FormGroup, form, ControlLabel, FormControl, FieldGroup, Glyphicon } from 'react-bootstrap'
import './gate.css'
import App from './App';
import Header from './header';

export default class Gate extends Component {

    constructor(props) {
    super(props);
    this.state = {
    	ShowTriggerValue: 0,
    	ShowClicked: false,
      }
  }


setupTrigger(value, bool){
	this.setState({ShowClicked: true , ShowTriggerValue: value})
}

render(){
	return(
		<div>
			    <Jumbotron id="jumbo" >
    <span></span>
      <div id="buttons" className="hideIt"  >


      <Grid id="jumbo-cups" >
        <Row>
            <Col xs={12} md={12} id="col" > 
           <div id='jumbo-fwk' className="fwk animated fadeIn" onClick={this.setupTrigger.bind(this, 2, true)}>
           <p id="white-space" > </p>
           <p>Flat</p>
           <p>White</p> 
           <p>King</p>
           <p id="white-space"> </p>  
           </div>
          </Col>
        <Col xs={12} md={4} id="col"> 
           <div id='jumbo-cup1' className="jumbo-cup animated bounceInDown" onClick={this.setupTrigger.bind(this, 0.8, true)}>
           <p>0.8 $ coffee</p> 
            <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
           </div>
        </Col>
        <Col xs={12} md={4} id="col" > 
           <div id='jumbo-cup2' className="jumbo-cup animated bounceInUp" onClick={this.setupTrigger.bind(this, 1, true)}>
           <p>1 $ coffee</p> 
            <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
           </div>
        </Col>
        <Col xs={12} md={4} id="col" > 
           <div id='jumbo-cup3' className="jumbo-cup animated bounceInDown" onClick={this.setupTrigger.bind(this, 2, true)}>
           <p>2 $ coffee</p> 
            <Image id="cup-image" src="https://img.icons8.com/doodle/96/000000/coffee-to-go.png" width='96px' height='96px' />
           </div>
          </Col>
        </Row>
       </Grid>
    </div>
  </Jumbotron>
  			<Header />
			<App ShowTriggerValue={this.state.ShowTriggerValue} ShowClicked={this.state.ShowClicked} />
		</div>
		)
}

}
