import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import Button from 'components/common/button/button';
import Popup from "reactjs-popup";
import { ToDoType } from 'App';
import './addForm.css';

interface Props {
  add: (item: ToDoType) => void
}

const dummyItem: ToDoType = {
  check: false,
  title: '',
  details: '',
  date: '',
  file: undefined
};

function AddForm({add}: Props) {
  const [item, setItem] = React.useState<ToDoType>(dummyItem);

  function handleChange (e: ChangeEvent<HTMLInputElement> , type: string) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    if(type === 'title') {
      setItem({...item, title: target.value});
    } else if(type === 'details') {
      setItem({...item, details: target.value});
    } else if(type === 'date') {
      setItem({...item, date: target.value});
    } else {
      setItem({...item, file: files[0]});
    }
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>, close: () => void) {
    e.preventDefault();

    add(item);
    setItem(dummyItem);
    close();
  }

  return (
    <Popup
      modal
      trigger={
        <button type="button" className='add-button'>
          Add ToDo
        </button>
      }
    >
      {((close: () => void) => 
        <form className='add' onSubmit={(e) => handleSubmit(e, close)}>
          <label>Title</label>
          <input placeholder="add title" value={item.title} onChange={(e) => handleChange(e, 'title')} required />
          <label>Details</label>
          <input placeholder="add details" value={item.details} onChange={(e) => handleChange(e, 'details')} required />
          <label>Date</label>
          <input type='date' value={item.date} onChange={(e) => handleChange(e, 'date')} required />
          <input type='file' onChange={(e) => handleChange(e, 'file')} />
          <Button type="submit">Add</Button>
        </form>
      ) as unknown as ReactNode}
    </Popup>
  );
}

export default AddForm;
