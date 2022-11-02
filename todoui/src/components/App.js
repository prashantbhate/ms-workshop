import React, { Component } from 'react';

// Bootstrap for react
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import TodoList from './TodoList';
import UserInput from './UserInput';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loadingStatus:'',
            error:'',
            podInfo:'',
        }
    }

    addItem(value) {
        this.setState({
            loadingStatus: 'adding',
            podInfo:'',
        });

        fetch(this.props.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'apikey':window._env_.API_KEY

            },
            body: JSON.stringify({
                name: value
            })
        })
            .then((response) => {
                this.setState({podInfo:response.headers.get('x-pod-name')})
                if (!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then(
                (result) => {
                    const list = [...this.state.list];
                    list.push(result);
                    this.setState({
                        loadingStatus: 'added',
                        list,
                        error:''
                    });
                },
                (error) => {
                    console.log(error)
                    this.setState({
                        loadingStatus: 'error adding',
                        error
                    });
                }
            )

    }

    updateItem(key,isDone) {
        this.setState({
            loadingStatus: 'updating',
            podInfo:'',
        });
        const todo = this.state.list.find(todo => todo.id === key);

        fetch(this.props.url + "/" + key, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'apikey':window._env_.API_KEY
            },
            body: JSON.stringify({
                ...todo,done:isDone
            })
        })
            .then((response) => {
                this.setState({podInfo:response.headers.get('x-pod-name')})
                if (!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then(
                (result) => {
                    const list = [...this.state.list];
                    const updateList = list.filter(item => item.id !== key);
                    updateList.push(result);
                    this.setState({
                        loadingStatus: 'updated',
                        list: updateList,
                        error:''
                    });
                },
                (error) => {
                    console.log(error)
                    this.setState({
                        loadingStatus: 'error updating',
                        error
                    });
                }
            )
    }
    deleteItem(key) {
        this.setState({
            loadingStatus: 'deleting',
            podInfo:'',
        });

        fetch(this.props.url + "/" + key, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'apikey':window._env_.API_KEY
            }
        })
            .then((response) => {
                this.setState({podInfo:response.headers.get('x-pod-name')})
                if (!response.ok) throw new Error(response.status);
                else return Promise.resolve();
            })
            .then(
                () => {
                    const list = [...this.state.list];
                    const updateList = list.filter(item => item.id !== key);
                    this.setState({
                        loadingStatus: 'deleted',
                        list: updateList,
                        error:''
                    });
                },
                (error) => {
                    console.log(error)
                    this.setState({
                        loadingStatus: 'error deleting',
                        error
                    });
                }
            )
    }
    componentDidMount() {
        this.setState({
            loadingStatus: 'loading',
            podInfo:'',
        });
        fetch(this.props.url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'apikey':window._env_.API_KEY
            }
        })
            .then((response) => {
                this.setState({podInfo:response.headers.get('x-pod-name')})
                if (!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then(
                (result) => {
                    this.setState({
                        loadingStatus: 'loaded',
                        list: result,
                        error:''
                    });
                },
                (error) => {
                    console.log(error)
                    this.setState({
                        loadingStatus: 'error loading',
                        error
                    });
                }
            )
    }

    render() {
        const { error, loadingStatus, list,podInfo } = this.state;
        const alertText = error?"error:"+error.message:"success!";
        const variant = error?"danger":"success";

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
                    onUpdate={(id,value) => this.updateItem(id,!value)}
                        value={list}
                    ></TodoList>
                </Col>
            </Row>

        </Container>);
    }
}

export default App;