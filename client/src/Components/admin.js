import React, { Component } from 'react';
import {Grid, Row, Col, Button, Tabs, Tab, Glyphicon} from 'react-bootstrap'
import _ from 'lodash';
import './admin.css'


export default class Admin extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      unConfirmedArray: [],
    };
  }

  handleSelect(key) {
    this.props.passKeyFromAdmin(key)
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
                      <p>{one.price} $</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <Button bsStyle="info" ><Glyphicon glyph="glyphicon glyphicon-search" /></Button>
                      <Button bsStyle="success" onClick={this.handleUpdate.bind(this, one._id)} ><Glyphicon glyph="glyphicon glyphicon-ok" /></Button>
                      <Button bsStyle="danger" ><Glyphicon glyph="glyphicon glyphicon-trash" /></Button>
                  </Col>
            </Row>))
}

printRowsDeleted(){
  return( _.map(this.props.toBeDeleted, (one, index) => <Row className="newRow">
                  <Col xs={4} md={4} > 
                      <p>{one.name}</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <p>{one.price} $</p>
                  </Col>
                  <Col xs={4} md={4} >
                      <Button bsStyle="info" ><Glyphicon glyph="glyphicon glyphicon-search" /> Show</Button>
                      <Button bsStyle="success" onClick={this.handleDelete.bind(this, one._id)} ><Glyphicon glyph="glyphicon glyphicon-ok" /> Submit</Button>
                      <Button bsStyle="danger" ><Glyphicon glyph="glyphicon glyphicon-trash" /> Decline</Button>
                  </Col>
            </Row>))
}
//
  render() {
    return (
      <div id='adminWindow' className='hideIt' >

            <Tabs
        activeKey={this.state.key}
        onSelect={this.handleSelect}
        id="controlled-tab-example"
      >
        <Tab eventKey={1} title="New locations">
            <Grid id="gridAdmin">
            <Row>
              <Col xs={12} md={12} className="column" >
                  <Row className="row-one" >
                        <Col xs={4} md={4} > 
                            <p>Name</p>
                        </Col>
                        <Col xs={4} md={4} >
                            <p>Price</p>
                        </Col>
                        <Col xs={4} md={4} >
                            <p>Action</p>
                        </Col>
                    </Row>
                   {this.printRows()}
                 </Col>
               </Row>
            </Grid>
      </Tab>
      <Tab eventKey={2} title="To be Deleted">
          <Grid id="gridAdmin">
            <Row>
              <Col xs={12} md={12} className="column" >
            <Row className="row-oneB">
                    <Col xs={4} md={4} > 
                        <p>Name</p>
                    </Col>
                    <Col xs={4} md={4} >
                        <p>Price</p>
                    </Col>
                    <Col xs={4} md={4} >
                        <p>Action</p>
                    </Col>
              </Row>
             {this.printRowsDeleted()}
           </Col>
         </Row>
        </Grid>
        </Tab>
      </Tabs>
     
       
       </div>
    );
  }
}



