import React from 'react';


import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import CloseButton from 'react-bootstrap/CloseButton';



function TodoList(props) {

    return (<ListGroup data-testid="todoList" >
        {/* map over and print items */}
        {
            props.value.map(item => {
                return (
                    <ListGroup.Item
                        key={item.id}
                        variant="dark"
                    >
                        <Stack direction='horizontal'>
                            <Form.Check
                                aria-label={item.id + '-' + item.name + '-check'}
                                label={item.name}
                                checked={item.done}
                                onChange={() => { props.onUpdate(item.id, item.done) }} />
                            <CloseButton
                                className="ms-auto"
                                aria-label={item.id + '-' + item.name}
                                onClick={() => { props.onDelete(item.id) }} />
                        </Stack>
                    </ListGroup.Item>
                )
            })
        }
    </ListGroup>);
}

export default TodoList;