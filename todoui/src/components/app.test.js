
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, fireEvent, waitFor, within, screen} from '@testing-library/react'
import '@testing-library/jest-dom'


import App from './App';


const server = setupServer(
  rest.get('/mocktodos', (req, res, ctx) => {
    return res(ctx.json([{"id":1,"name":"Watch RRR","done":true}]))
  }),
  rest.get('/load_error_mocktodos', (req, res, ctx) => {
    return res(ctx.status(500))
  }),

  rest.put('/mocktodos/111', (req, res, ctx) => {
    return res(ctx.json({"name":req.body.name,id:111,"done":req.body.done}))
  }),
  rest.get('/update_error_mocktodos', (req, res, ctx) => {
    return res(ctx.json([{"id":1,"name":"Watch RRR","done":true}]))
  }),
  rest.put('/update_error_mocktodos/1', (req, res, ctx) => {
    return res(ctx.status(500))
  }),

  rest.post('/mocktodos', (req, res, ctx) => {
    return res(ctx.status(201),ctx.json({"name":req.body.name,id:111}))
  }),
  rest.get('/add_error_mocktodos', (req, res, ctx) => {
    return res(ctx.json([{"id":1,"name":"Watch RRR","done":true}]))
  }),
  rest.post('/add_error_mocktodos', (req, res, ctx) => {
    return res(ctx.status(500))
  }),

  rest.delete('/mocktodos/111', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.get('/delete_error_mocktodos', (req, res, ctx) => {
    return res(ctx.json([{"id":1,"name":"Watch RRR","done":true}]))
  }),
  rest.delete('/delete_error_mocktodos/1', (req, res, ctx) => {
    return res(ctx.status(500))
  }),
)


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

afterEach(() => {
  jest.clearAllMocks();
});

window._env_ = {
  API_URL: "http://localhost:3000/todos",
  API_KEY: "dummy",
}


test('it should add update remove todo on button click', async () => {
  render(<App url="/mocktodos" />);

  // load todos
  expect(screen.getByText('TODO LIST')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText("loading")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("loaded")).toBeInTheDocument());
  
  const list = screen.getByTestId("todoList")
  const { queryAllByRole } = within(list)
  var items = queryAllByRole("button")
  var checkboxes = queryAllByRole("checkbox")
  expect(items.length).toBe(1);
  expect(checkboxes.length).toBe(1);


  // add todos

  const button = screen.getByLabelText ('add todo');
  const input = screen.getByRole('textbox');

  //empty text should do nothing
  fireEvent.change(input, { target: { value: '' } })
  fireEvent.click(button);

  fireEvent.change(input, { target: { value: 'todo text' } })
  fireEvent.click(button);
  await waitFor(() => expect(screen.getByText("adding")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("added")).toBeInTheDocument());

  items = queryAllByRole("button")
  checkboxes = queryAllByRole("checkbox")
  expect(items.length).toBe(2);
  expect(checkboxes.length).toBe(2);


  //update todos

  const todoCheckbox = screen.getByLabelText ('111-todo text-check');
  fireEvent.click(todoCheckbox);

  await waitFor(() => expect(screen.getByText("updating")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("updated")).toBeInTheDocument());

  //delete todos

  const todoButton = screen.getByLabelText ('111-todo text');
  fireEvent.click(todoButton);

  await waitFor(() => expect(screen.getByText("deleting")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("deleted")).toBeInTheDocument());
  
  items = queryAllByRole("button")
  checkboxes = queryAllByRole("checkbox")
  expect(items.length).toBe(1);
  expect(checkboxes.length).toBe(1);

});

test('it should handle error while loading todo', async () => {
  render(<App url="/load_error_mocktodos" />);
  await waitFor(() => expect(screen.getByText("loading")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error loading")).toBeInTheDocument());  
  await waitFor(() => expect(screen.getByText("error:500")).toBeInTheDocument());  
});

test('it should handle error while adding todo', async () => {
  render(<App url="/add_error_mocktodos" />);
  await waitFor(() => expect(screen.getByText("loading")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("loaded")).toBeInTheDocument());
  
  const button = screen.getByLabelText ('add todo');
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'todo text' } })
  fireEvent.click(button);
  await waitFor(() => expect(screen.getByText("adding")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error adding")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error:500")).toBeInTheDocument());  
  
});

test('it should handle error while updating todo', async () => {
  render(<App url="/update_error_mocktodos" />);
  await waitFor(() => expect(screen.getByText("loading")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("loaded")).toBeInTheDocument());

  const todoCheckbox = screen.getByLabelText ('1-Watch RRR-check');
  fireEvent.click(todoCheckbox);

  await waitFor(() => expect(screen.getByText("updating")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error updating")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error:500")).toBeInTheDocument());  
  
});


test('it should handle error while deleting todo', async () => {
  render(<App url="/delete_error_mocktodos" />);
  await waitFor(() => expect(screen.getByText("loading")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("loaded")).toBeInTheDocument());

  const todoButton = screen.getByLabelText ('1-Watch RRR');
  fireEvent.click(todoButton);

  await waitFor(() => expect(screen.getByText("deleting")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error deleting")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("error:500")).toBeInTheDocument());
});

