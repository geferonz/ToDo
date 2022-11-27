import Button from 'components/common/button/button';
import deleteImg from 'assets/icon/delete.svg';
import changeImg from 'assets/icon/change.svg';
import fileImg from 'assets/icon/file.svg';
import { ToDoType } from 'App';
import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import dayjs from 'dayjs';
import Popup from "reactjs-popup";
import './toDoItem.css';

interface Props {
  handleCheck: () => void,
  todoItem: ToDoType,
  deleteItem: () => void,
  editItem: (item: ToDoType) => void
}

function ToDoItem({handleCheck, todoItem, deleteItem, editItem}: Props) {
  const [item, setItem] = React.useState<ToDoType>(todoItem);

  const downloadFile = () => {
    if(todoItem.file) {
      // file object
      const file = new Blob([todoItem.file]);
      // anchor link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `${todoItem.file?.name}`;
      // simulate link click
      document.body.appendChild(link); // Required for this to work in FireFox
      link.click();
    }
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>, close: () => void) {
    e.preventDefault();

    editItem(item);
    close();
  }

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

  return (
    <div className={`item${todoItem.check || dayjs().diff(dayjs(todoItem.date)) >= 0 ? ' inactive' : ''}`}>
      <input type='checkbox' checked={todoItem.check} onChange={handleCheck} />
      <div className='info'>
        <div className='title'>{todoItem.title}</div>
        <div className='details'>{todoItem.details}</div>
        <div className='date'>{dayjs(todoItem.date).format('DD-MM-YYYY')}</div>
      </div>
      <Button type="button" onClick={deleteItem} title='Delete'>
        <img src={deleteImg} alt='' />
      </Button>
      {!todoItem.check && <>
          <Popup
            modal
            trigger={
              <button type="button" title='Change'>
              <img src={changeImg} alt='' />
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
                <input type='date' value={dayjs(item.date).format('YYYY-MM-DD')} onChange={(e) => handleChange(e, 'date')} required />
                <input type='file' onChange={(e) => handleChange(e, 'file')} />
                <div className='actions'>
                  <div className='contain' />
                  <Button type="button" onClick={close}>Close</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            ) as unknown as ReactNode}
          </Popup>
        </>
      }
      {Boolean(todoItem.file) && <Button type='button' onClick={downloadFile} title={todoItem.file?.name}>
        <img src={fileImg} alt='' />
      </Button>}
    </div>
  );
}

export default ToDoItem;
