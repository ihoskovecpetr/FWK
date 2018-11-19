import React, { Component } from 'react';
import {Grid, Row, Col, Button, FormGroup, ControlLabel } from 'react-bootstrap'
import './detail.css'


export default class Detail extends Component {
    constructor(props) {
    super(props);
        this.state = {

      }
  }

  componentDidMount(){

}




  render() {
    
    return (
      <div id='detailWindow' className='hideIt' >
    <form id="detailForm" >
      <div id="new-place-header"></div>
          <Grid id="grid">
            <Row className="show-grid">

              <FormGroup>
                  <Col xs={12} md={6} >
                     <ControlLabel><p>Name of this place:</p></ControlLabel>
                  </Col>
                    <Col xs={12} md={6} >
                     <ControlLabel><p> {this.props.venue.name}</p></ControlLabel>
                  </Col>

              </FormGroup>
            </Row>
          <Row>
                 <Button bsStyle="info" className="button" >Submit</Button>
          </Row>
        </Grid>
      </form>
      </div>
    );
  }
}



