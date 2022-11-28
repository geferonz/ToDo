import { db, storage } from "firebase.js";
import { ref, deleteObject } from "firebase/storage";
import dayjs from "dayjs";
import React from "react";

import AddForm from "components/ToDo/addForm/addForm";
import FiltersGroup from "components/ToDo/filtersGroup/filtersGroup";
import Container from "components/common/container/container";
import DeleteButtonGroup from "components/ToDo/deleteButtonGroup/deleteButtonGroup";
import Divider from "components/common/divider/divider";
import ToDoItem from "components/ToDo/toDoItem/toDoItem";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import "./App.css";

export interface ToDoType {
  id?: string;
  check: boolean;
  title: string;
  details: string;
  date: string;
  file?: File;
  fileUrl: string;
  fileName: string;
}

export type filter = "active" | "completed" | "expired" | "all";

function App() {
  const [todo, setTodo] = React.useState<ToDoType[]>([]);
  const [filter, setFilter] = React.useState<filter>("all");

  React.useEffect(() => {
    onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodo(
        snapshot.docs.map((item: any) => {
          return { id: item.id, ...item.data() };
        })
      );
    });
  }, []);

  /**
   * ToDo list filtering function
   * @return filtered ToDo
   */
  function filteredList() {
    if (filter === "active") {
      return todo.filter(
        (item) => item.check === false && dayjs().diff(dayjs(item.date)) < 0
      );
    } else if (filter === "completed") {
      return todo.filter((item) => item.check === true);
    } else if (filter === "expired") {
      return todo.filter((item) => dayjs().diff(dayjs(item.date)) >= 0);
    } else {
      return todo;
    }
  }

  const filtered = filteredList();

  /**
   * ToDo item edit function
   * @param { ToDoType } todoItem passing the todo element
   * @param { string } id passing the todo id
   * @return filtered ToDo
   */
  function editToDo(todoItem: ToDoType, id?: string) {
    if (id) {
      updateDoc(doc(db, "todos", id), { ...todoItem })
        .then()
        .catch((error) => {
          console.log(error.message);
        });
    }
  }

  /**
   * The function of deleting the ToDo element and the file attached to it
   * @param {string} id passing the todo id
   */
  function deleteToDo(id?: string) {
    if (id) {
      deleteDoc(doc(db, "todos", id));

      const url = todo.filter((item) => item.id === id)[0].fileUrl;

      if (url) {
        // Create a reference to the file to delete
        const desertRef = ref(storage, url);

        // Delete the file
        deleteObject(desertRef)
          .then()
          .catch((error) => {
            console.log(error.message);
          });
      }
    }
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <AddForm />
      {Boolean(todo.length) && (
        <>
          <FiltersGroup changeFilter={setFilter} />
          {Boolean(filtered.length) && (
            <Container>
              {filtered.map((item, index) => {
                function handleCheck() {
                  if (item.id) {
                    editToDo({ ...item, check: !item.check }, item.id);
                  }
                }

                return (
                  <div key={item.id}>
                    <ToDoItem
                      todoItem={item}
                      handleCheck={handleCheck}
                      deleteItem={() => deleteToDo(item.id)}
                      editItem={(item: ToDoType) => editToDo(item, item.id)}
                    />
                    {index < filtered.length - 1 ? <Divider /> : null}
                  </div>
                );
              })}
            </Container>
          )}
          <DeleteButtonGroup todo={todo} />
        </>
      )}
    </div>
  );
}

export default App;
