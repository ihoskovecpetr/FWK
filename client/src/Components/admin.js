import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap'
import _ from 'lodash';
import './admin.css'


export default class Admin extends Component {
    constructor(props) {
    super(props);
        this.state = {
            unConfirmedArray: [],
      }
  }

  componentDidMount(){

}

handleUpdate(id){
  this.props.update(id)
}

handleDelete(id){
  this.props.delete(id)
}

printRows(){
  return( _.map(this.props.unconfirmed, (one, index) => <Row className="newRow">
                  <Col xs={4} md={4} > 
                      <p>{one.name}</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <p>{one.price}</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <Button bsStyle="info" >Show</Button>
                      <Button bsStyle="success" onClick={this.handleUpdate.bind(this, one._id)} >Submit</Button>
                      <Button bsStyle="danger" >Decline</Button>
                  </Col>
            </Row>))
}

printRowsDeleted(){
  return( _.map(this.props.toBeDeleted, (one, index) => <Row className="newRow">
                  <Col xs={4} md={4} > 
                      <p>{one.name}</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <p>{one.price}</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <Button bsStyle="info" >Show</Button>
                      <Button bsStyle="success" onClick={this.handleDelete.bind(this, one._id)} >Submit</Button>
                      <Button bsStyle="danger" >Decline</Button>
                  </Col>
            </Row>))
}
//
  render() {
    return (
      <div id='adminWindow' className='hideIt' >
     
        <Grid id="gridAdmin">
          <Row>
            <Col xs={6} md={6} className="column">
              <Row>
                <Col xs={12} md={12} >
                    <h1>Suggested to Add</h1>
                </Col>
              </Row>
              <Row >
                    <Col xs={4} md={4} > 
                        <p>Name</p>
                    </Col>
                    <Col xs={4} md={4} >
                        <p>price</p>
                    </Col>
                    <Col xs={4} md={4} >
                        <p>action's</p>
                    </Col>
                </Row>
               {this.printRows()}
            </Col>
            <Col xs={6} md={6} className="column" >
            <Row>
          <Col xs={12} md={12} >
              <h1>To be Deleted</h1>
          </Col>
          </Row>
          <Row>
                  <Col xs={4} md={4} > 
                      <p>Name</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <p>price</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <p>action's</p>
                  </Col>
            </Row>
           {this.printRowsDeleted()}
           </Col>
         </Row>
        </Grid>
       </div>
    );
  }
}



