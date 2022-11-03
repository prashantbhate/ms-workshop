import { render, screen, fireEvent, within } from '@testing-library/react';
import TodoList from './TodoList';



test('it should list items', () => {
  const array = [];
  for (let index = 0; index < 5; index++) {
    array.push({
      id: index,
      value: 'todo' + index,
      done: false
    });

  }

  render(<TodoList value={array} />);

  const list = screen.getByTestId("todoList")
  const { queryAllByRole } = within(list)
  const items = queryAllByRole("button")
  expect(items.length).toBe(5);

});

test('it should callback on click', () => {
  const array = [];
  for (let index = 0; index < 5; index++) {
    array.push({
      id: index,
      name: 'todo' + index,
      done: false
    });

  }
  const onDeleteMock = jest.fn();
  const onUpdateMock = jest.fn();

  render(<TodoList
    onDelete={onDeleteMock}
    onUpdate={onUpdateMock}
    value={array} />);

  const closeButton = screen.getByLabelText('1-todo1');
  fireEvent.click(closeButton);

  expect(onDeleteMock.mock.calls.length).toBe(1);
  expect(onDeleteMock.mock.calls[0][0]).toBe(1);

  const checkbox = screen.getByLabelText('1-todo1-check');
  fireEvent.click(checkbox);
  expect(onUpdateMock.mock.calls.length).toBe(1);
  expect(onUpdateMock.mock.calls[0][0]).toBe(1);
  expect(onUpdateMock.mock.calls[0][1]).toBe(true);

});
