import React, { Component } from 'react';
import {Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import './new-input-window.css'


export default class NewVenue extends Component {
    constructor(props) {
    super(props);
        this.state = {
            unConfirmedArray: [],
      }
  }

  componentDidMount(){

}

handleOnSubmit(e){
  e.preventDefault();
  this.props.onSubmit();
}

// handleClose(e){   e.preventDefault(); this.props.onClose();}



  render() {
    return (
<form id="newInput" className="hideIt" >
          <Grid id="grid">
            <Row className="show-grid">

              <FormGroup>
                  <Col xs={2} md={4} >
                     <ControlLabel><p>Name</p></ControlLabel>
                  </Col>
                  <Col xs={10} md={8}>
                   <FormControl placeholder="Best coffee Gatton" type="text" id="inputName" />
                  </Col>

              </FormGroup>
            </Row>
            <Row>
             <FormGroup>
                <Col xs={2} md={4} >
                  <ControlLabel><p>Price</p></ControlLabel>
                </Col>
                <Col xs={10} md={8}>
                  <FormControl componentClass="select" placeholder="select" id="inputPrice">
                  <option value="0.8" >0.8$</option>
                  <option value="1" >1$</option>
                  <option value='2' >2$</option>
                </FormControl>
                </Col>
            </FormGroup>
          </Row>
          <Row>
                 <Button bsStyle="success" className="button" id="btn-submit" type="submit" onClick={this.handleOnSubmit.bind(this)} >Submit</Button>
          </Row>
        </Grid>
</form>
    );
  }
}



