import React, { useState, useRef, useEffect } from 'react';

// Bootstrap for react
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function UserInput(props) {
    const [input, setInput] = useState('');
    const ref = useRef(null);

    const onClick = () => {
        if (input !== '') {
            const value = input
            setInput('')
            ref.current.focus();
            props.onChange(value);
        }
    };

    useEffect(() => {
        ref.current.focus();
    });

    return (<InputGroup className="mb-3">
        <Form.Control
            placeholder="add item . . . "
            size="lg"
            ref={ref}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}

            aria-label="add text"
            aria-describedby="basic-addon2"
        />
        <Button
            variant="dark"
            size="lg"
            aria-label="add todo"
            onClick={onClick}
        >
            ADD
        </Button>
    </InputGroup>);

}

// class UserInput1 extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             userInput: ""
//         }
//     }

//     updateInput(value) {
//         this.setState({
//             userInput: value,
//         });
//     }

//     onClick() {
//         if (this.state.userInput !== '') {
//             const input = this.state.userInput
//             this.setState({
//                 userInput: ""
//             });
//             this.props.onChange(input);
//         }
//     }

//     render() {
//         return (<InputGroup className="mb-3">
//             <FormControl
//                 placeholder="add item . . . "
//                 size="lg"
//                 value={this.state.userInput}
//                 onChange={item => this.updateInput(item.target.value)}
//                 aria-label="add text"
//                 aria-describedby="basic-addon2"
//             />
//             <Button
//                 variant="dark"
//                 size="lg"
//                 aria-label="add todo"
//                 onClick={() => this.onClick()}
//             >
//                 ADD
//             </Button>
//         </InputGroup>);
//     }
// }

export default UserInput;