import React, { Component } from 'react';

// Bootstrap for react
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';

class App extends Component {
    
    render() {
        return (<Container>

            <Row style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: '3rem',
                fontWeight: 'bolder',
            }}
            >TODO LIST
            </Row>
        </Container>);
    }
}

export default App;