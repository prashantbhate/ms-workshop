import { render, screen, fireEvent, within } from '@testing-library/react';
import UserInput from './UserInput';

test('it should have ADD button', () => {
    render(<UserInput />);
    const element = screen.queryByRole('button');
    expect(element).toBeInTheDocument();
});

test('it should have input', () => {
    render(<UserInput />);
    const element = screen.queryByRole('textbox');
    expect(element).toBeInTheDocument();
});


test('it should callback on button click after textentry', () => {

    const onChangeMock = jest.fn();

    render(<UserInput onChange={onChangeMock} />);

    const button = screen.getByRole('button');
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'text' } })
    fireEvent.click(button);

    expect(onChangeMock.mock.calls.length).toBe(1);
    expect(onChangeMock.mock.calls[0][0]).toBe('text');

});

test('it should not callback on button click with empty text', () => {

    const onChangeMock = jest.fn();

    render(<UserInput onChange={onChangeMock} />);

    const button = screen.getByRole('button');
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(button);

    expect(onChangeMock.mock.calls.length).toBe(0);

});

