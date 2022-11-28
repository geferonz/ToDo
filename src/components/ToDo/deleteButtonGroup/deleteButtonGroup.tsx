import { doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "firebase.js";
import { ref, deleteObject } from "firebase/storage";

import Button from "components/common/button/button";
import { ToDoType } from "App";

import "./deleteButtonGroup.css";

interface Props {
  todo: ToDoType[];
}

function DeleteButtonGroup({ todo }: Props) {
  function deleteToDo(id?: string) {
    if (id) {
      deleteDoc(doc(db, "todos", id));
    }
  }

  function deleteFile(url: string) {
    if (!url) return;

    /**
     * Create a reference to the file to delete
     */
    const desertRef = ref(storage, url);

    /**
     * Delete the file
     */
    deleteObject(desertRef)
      .then()
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Delete completed items ToDo function
   */
  function deleteCompleted() {
    todo
      .filter((item) => item.check)
      .forEach((item) => {
        deleteToDo(item.id);
        deleteFile(item.fileUrl);
      });
  }

  /**
   * Clear ToDo list function
   */
  function deleteAll() {
    todo.forEach((item) => {
      deleteToDo(item.id);
      deleteFile(item.fileUrl);
    });
  }

  return (
    <div className="delete">
      <div className="contain" />
      <Button type="button" onClick={deleteAll}>
        Delete all
      </Button>
      <Button type="button" onClick={deleteCompleted}>
        Clear completed
      </Button>
    </div>
  );
}

export default DeleteButtonGroup;
