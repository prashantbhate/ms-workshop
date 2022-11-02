import React, { Component } from 'react';

// Bootstrap for react
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

class UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: ""
        }
    }

    updateInput(value) {
        this.setState({
            userInput: value,
        });
    }

    onClick() {
        if (this.state.userInput !== '') {
            const input = this.state.userInput
            this.setState({
                userInput: ""
            });
            this.props.onChange(input);
        }
    }

    render() {
        return (<InputGroup className="mb-3">
            <FormControl
                placeholder="add item . . . "
                size="lg"
                value={this.state.userInput}
                onChange={item => this.updateInput(item.target.value)}
                aria-label="add text"
                aria-describedby="basic-addon2"
            />
            <Button
                variant="dark"
                size="lg"
                aria-label="add todo"
                onClick={() => this.onClick()}
            >
                ADD
            </Button>
        </InputGroup>);
    }
}

export default UserInput;