import Button from 'components/common/button/button';
import { filter } from 'App';
import './filtersGroup.css';

interface Props {
  changeFilter: React.Dispatch<React.SetStateAction<filter>>
}

function FiltersGroup({changeFilter}: Props) {
  
  function setActiveFilter(filter: filter) {
    const activeFilterButton = document.getElementById(filter);
    const filterButtonsGroup = Array.from(document.getElementsByClassName('filter'));

    changeFilter(filter);

    filterButtonsGroup.forEach(
      item => item.classList.remove('active')
    );
    
    activeFilterButton?.classList.add('active');
  }

  return (
    <div className="filters">
      <Button type="button" id='all' className='filter active' onClick={() => setActiveFilter('all')}>All</Button>
      <Button type="button" id='active' className='filter' onClick={() => setActiveFilter('active')}>Active</Button>
      <Button type="button" id='completed' className='filter' onClick={() => setActiveFilter('completed')}>Completed</Button>
      <Button type="button" id='expired' className='filter' onClick={() => setActiveFilter('expired')}>Expired</Button>
    </div>
  );
}

export default FiltersGroup;
