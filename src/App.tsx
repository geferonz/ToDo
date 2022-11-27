import AddForm from 'components/ToDo/addForm/addForm';
import FiltersGroup from 'components/ToDo/filtersGroup/filtersGroup';
import Container from 'components/common/container/container';
import DeleteButtonGroup from 'components/ToDo/deleteButtonGroup/deleteButtonGroup';
import Divider from 'components/common/divider/divider';
import ToDoItem from 'components/ToDo/toDoItem/toDoItem';
import dayjs from 'dayjs';
import React from 'react';
import './App.css';

export interface ToDoType {
  check: boolean,
  title: string,
  details: string,
  date: string,
  file?: File
}

export type filter = 'active' | 'completed' | 'expired' | 'all';

function App() {
  const [todo, setTodo] = React.useState<ToDoType[]>([]);
  const [filter, setFilter] = React.useState<filter>('all');

  let filtered;

  if(filter === 'active') {
    filtered = todo.filter(item => item.check === false);
  } else if(filter === 'completed') {
    filtered = todo.filter(item => item.check === true);
  } else if(filter === 'expired') {
    filtered = todo.filter(item =>  dayjs().diff(dayjs(item.date)) >= 0);
  } else {
    filtered = todo;
  }

  function addToDo(item: ToDoType) {
    const newToDo = [...todo, item];
    setTodo(newToDo);
  }

  function editToDo(todoItem: ToDoType, id: number) {
    setTodo(todo.map((item, index) => index === id ? todoItem : item));
  }

  function deleteToDo(id: number) {
    setTodo(todo.filter((item, index) => id !== index))
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <AddForm add={addToDo} />
      {
        Boolean(todo.length) && <>
          <FiltersGroup changeFilter={setFilter} />
          {Boolean(filtered.length) && <Container>
            {
              filtered.map(
                (item, index) => {
                  function handleCheck () {
                    todo[index].check = !todo[index].check
                    setTodo([...todo])
                  }

                  return (
                    <div key={index}>
                      <ToDoItem todoItem={item} handleCheck={handleCheck} deleteItem={() => deleteToDo(index)} editItem={(item: ToDoType) => editToDo(item, index)} />
                      {index < filtered.length - 1 ? <Divider /> : null}
                    </div>
                  )
                }
              )
            }
          </Container>}
          <DeleteButtonGroup todo={todo} change={setTodo} />
        </>
      }
    </div>
  );
}

export default App;
