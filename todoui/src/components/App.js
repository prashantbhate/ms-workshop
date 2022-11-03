import React, { useState, useEffect } from 'react';

// Bootstrap for react
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';


import { createtodo, updatetodo, removetodo, listtodo } from './todoApiClient';

import TodoList from './TodoList';
import UserInput from './UserInput';

function App(props) {
    const [list, setList] = useState([]);
    const [stale, setStale] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [error, setError] = useState('');
    const [podInfo, setPodInfo] = useState('');
    const [alertText, setAlertText] = useState('');
    const [variant, setVariant] = useState('');

    const resetState = (status) => {
        console.log(status)
        setLoadingStatus(status)
        setPodInfo('')
        setError('')
        setStale(false)
    }

    const handleResponse = (response) => {
        console.log("response:" + response.status)
        setPodInfo(response.headers.get('x-pod-name'))
        if (!response.ok) throw new Error(response.status);
        if (response.status === 204) return Promise.resolve();
        return response.json();
    }

    const handleError = (error, status) => {
        console.log(error)
        setLoadingStatus(status)
        setError(error)
    }

    const addItem = (value) => {
        resetState('start adding');
        createtodo(props.url, { name: value })
            .then((result) => handleResponse(result))
            .then(
                (result) => {
                    setLoadingStatus('added');
                    setStale(true);
                }, (error) => handleError(error, 'error adding')
            )
    }

    const updateItem = (key, isDone) => {
        resetState('start updating');
        const todo = list.find(todo => todo.id === key);
        updatetodo(props.url + "/" + key, { ...todo, done: isDone })
            .then((result) => handleResponse(result))
            .then(
                (result) => {
                    setLoadingStatus('updated');
                    setStale(true);
                }, (error) => handleError(error, 'error updating'));
    }

    const deleteItem = (key) => {
        resetState('start deleting');
        removetodo(props.url + "/" + key)
            .then((result) => handleResponse(result))
            .then(
                () => {
                    setLoadingStatus('deleted');
                    setStale(true);
                }, (error) => handleError(error, 'error deleting'));
    }

    useEffect(() => {
        if (stale) {
            const timer = setTimeout(() => {
                const re = loadingStatus === '' ? '' : 're';
                resetState('start ' + re + 'loading');
                listtodo(props.url)
                    .then((result) => handleResponse(result))
                    .then(
                        (result) => {
                            setLoadingStatus(re + 'loaded')
                            setList(result)
                        }, (error) => handleError(error, 'error ' + re + 'loading'));
            }, 100);
            return () => clearTimeout(timer);
        }

    }, [stale, loadingStatus, props.url]);

    useEffect(() => {
        setAlertText(error ? "error:" + error.message : "success!");
        setVariant(error ? "danger" : "success");
    }, [error]);



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
                <UserInput onChange={addItem} />
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
                    onDelete={deleteItem}
                    onUpdate={updateItem}
                    value={list}
                ></TodoList>
            </Col>
        </Row>

    </Container>);

}

export default App;