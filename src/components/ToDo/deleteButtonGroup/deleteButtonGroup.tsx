import Button from 'components/common/button/button';
import { ToDoType } from 'App';
import './deleteButtonGroup.css';

interface Props {
  todo: ToDoType[],
  change: React.Dispatch<React.SetStateAction<ToDoType[]>>
}

function DeleteButtonGroup({todo, change}: Props) {

  function deleteCompleted() {
    change(todo.filter(item => !item.check))
  }

  function deleteAll() {
    change([])
  }

  return (
    <div className='delete'>
      <Button type="button" onClick={deleteAll}>Clear all</Button>
      <Button type="button" onClick={deleteCompleted}>Clear completed</Button>
    </div>
  );
}

export default DeleteButtonGroup;
