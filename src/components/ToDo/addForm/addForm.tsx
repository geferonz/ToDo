import React, { ChangeEvent, FormEvent, ReactNode } from "react";
import Popup from "reactjs-popup";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Button from "components/common/button/button";
import { ToDoType } from "App";

import "./addForm.css";

const dummyItem: ToDoType = {
  check: false,
  title: "",
  details: "",
  date: "",
  file: undefined,
  fileUrl: "",
  fileName: "",
};

function AddForm() {
  const [item, setItem] = React.useState<ToDoType>(dummyItem);

  function handleChange(e: ChangeEvent<HTMLInputElement>, type: string) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    if (type === "title") {
      setItem({ ...item, title: target.value });
    } else if (type === "details") {
      setItem({ ...item, details: target.value });
    } else if (type === "date") {
      setItem({ ...item, date: target.value });
    } else {
      setItem({ ...item, file: files[0] });
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, close: () => void) {
    e.preventDefault();

    if (item.file) {
      const storageRef = ref(storage, `/files/${item.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => console.log(error),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            addDoc(collection(db, "todos"), {
              check: item.check,
              title: item.title,
              details: item.details,
              date: item.date,
              fileUrl: url,
              fileName: item.file?.name,
            });
            setItem(dummyItem);
          });
        }
      );
    } else {
      addDoc(collection(db, "todos"), {
        check: item.check,
        title: item.title,
        details: item.details,
        date: item.date,
        fileUrl: "",
        fileName: "",
      });
      setItem(dummyItem);
    }

    close();
  }

  return (
    <Popup
      modal
      trigger={
        <button type="button" className="add-button">
          Add ToDo
        </button>
      }
    >
      {
        ((close: () => void) => (
          <form className="add" onSubmit={(e) => handleSubmit(e, close)}>
            <label>Title</label>
            <input
              placeholder="add title"
              value={item.title}
              onChange={(e) => handleChange(e, "title")}
              required
            />
            <label>Details</label>
            <input
              placeholder="add details"
              value={item.details}
              onChange={(e) => handleChange(e, "details")}
              required
            />
            <label>Date</label>
            <input
              type="date"
              value={item.date}
              onChange={(e) => handleChange(e, "date")}
              required
            />
            <label>File</label>
            <input type="file" onChange={(e) => handleChange(e, "file")} />
            <Button type="submit">Add</Button>
          </form>
        )) as unknown as ReactNode
      }
    </Popup>
  );
}

export default AddForm;
