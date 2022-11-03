import React, { Component } from 'react';

// Bootstrap for react
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';


import { create, update, remove, list } from './todoApiClient';

import TodoList from './TodoList';
import UserInput from './UserInput';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loadingStatus: '',
            error: '',
            podInfo: '',
        }
    }

    resetState(status) {
        console.log(status)
        this.setState({
            loadingStatus: status,
            podInfo: '',
            error: ''
        })
    }

    handleResponse(response) {
        console.log("response:" + response.status)
        this.setState({ podInfo: response.headers.get('x-pod-name') })
        if (!response.ok) throw new Error(response.status);
        if (response.status === 204) return Promise.resolve();
        return response.json();
    }

    handleError(error, status) {
        console.log(error)
        this.setState({
            loadingStatus: status,
            error
        });

    }

    addItem(value) {
        this.resetState('adding');
        create(this.props.url, { name: value })
            .then((result) => this.handleResponse(result))
            .then(
                (result) => {
                    const list = [...this.state.list];
                    list.push(result);
                    this.setState({
                        loadingStatus: 'added',
                        list,
                    });
                }, (error) => this.handleError(error, 'error adding')
            )
    }

    updateItem(key, isDone) {
        this.resetState('updating');
        const todo = this.state.list.find(todo => todo.id === key);

        update(this.props.url + "/" + key, { ...todo, done: isDone })
            .then((result) => this.handleResponse(result))
            .then(
                (result) => {
                    const list = [...this.state.list];
                    const updateList = list.filter(item => item.id !== key);
                    updateList.push(result);
                    this.setState({
                        loadingStatus: 'updated',
                        list: updateList,
                    });
                }, (error) => this.handleError(error, 'error updating'));
    }
    deleteItem(key) {
        this.resetState('deleting');
        remove(this.props.url + "/" + key)
            .then((result) => this.handleResponse(result))
            .then(
                () => {
                    const list = [...this.state.list];
                    const updateList = list.filter(item => item.id !== key);
                    this.setState({
                        loadingStatus: 'deleted',
                        list: updateList,
                    });
                }, (error) => this.handleError(error, 'error deleting'));
    }

    componentDidMount() {
        this.resetState('loading');
        list(this.props.url)
            .then((result) => this.handleResponse(result))
            .then(
                (result) => {
                    this.setState({
                        loadingStatus: 'loaded',
                        list: result,
                    });
                }, (error) => this.handleError(error, 'error loading'));
    }

    render() {
        const { error, loadingStatus, list, podInfo } = this.state;
        const alertText = error ? "error:" + error.message : "success!";
        const variant = error ? "danger" : "success";

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
            <hr />
            <Row>
                <Col md={{ span: 5, offset: 4 }}>
                    <UserInput onChange={value => this.addItem(value)} />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 5, offset: 4 }}>
                    <Alert variant={variant}>
                        <Alert.Heading>{loadingStatus}</Alert.Heading>
                        <p>{alertText}</p>
                        <p><b>UI loaded from:</b>{window._env_.POD_NAME}</p>
                        <p><b>Request served by:</b>{podInfo}</p>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 5, offset: 4 }}>
                    <TodoList
                        onDelete={id => this.deleteItem(id)}
                        onUpdate={(id, value) => this.updateItem(id, !value)}
                        value={list}
                    ></TodoList>
                </Col>
            </Row>

        </Container>);
    }
}

export default App;