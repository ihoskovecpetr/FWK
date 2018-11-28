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

handleDelete(_id){
  console.log("_id-cko")
  console.log(_id)
  this.props.markItDelete(_id)
//  this.props.fceDelete(_id)
}



  render() {
    
    return (
      <div id='detailWindow' className='hideIt' >
    <form id="detailForm" >
      <div id="new-place-header"></div>
          <Grid id="grid">
            <Row className="show-grid">

              <FormGroup>
                  <Col xs={4} md={4} >
                     <ControlLabel><p>Name</p></ControlLabel>
                  </Col>
                    <Col xs={4} md={4} >
                     <ControlLabel><b><p>{this.props.venue.name}</p></b></ControlLabel>
                  </Col>
                 <Col xs={4} md={4} >
                    <Button bsStyle="danger" className="button-info" onClick={this.handleDelete.bind(this, this.props.venue._id)} >Delete</Button>
                  </Col>

              </FormGroup>
            </Row>

        </Grid>
      </form>
      </div>
    );
  }
}



