import { SetStateAction, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Header from '../../components/Header';
import AddTaskModal from '../../components/AddTaskModal';
import TaskList from '../../components/TaskList';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import Navbar from '../../components/Navbar';
import Select from '../../components/Select';

import { getAllTask, deleteTask } from '../../api/taskApi';

import useDebounce from '../../hooks/useDebounce';

import { Task } from '../../interface/Task';

import { PRIORITIES } from '../../constants/priority';
import { STATUS_LIST } from '../../constants/status';

export default function Home() {
  const [refetch, setReftech] = useState(false);
  const [open, setOpen] = useState(false);

  const [cookies] = useCookies(['authToken']);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchValue = useDebounce(searchQuery, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: 0,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const limit = 4;

  const skip = (currentPage - 1) * limit;

  const authToken = cookies.authToken;

  const handleSearch = (query: SetStateAction<string>) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleTaskEdit = (task: Task) => {
    console.log(task);
    setTaskToEdit(task);
    setOpen(true);
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await deleteTask(id, authToken);
      setReftech(!refetch);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    console.log(filters);
    const fetchData = async () => {
      try {
        const queryFilters = {
          limit,
          skip,
          searchQuery,
          filters,
        };
        const data = await getAllTask(queryFilters, authToken);
        setTasks(data.tasks);
        setTotalItems(data.totalTasksCount);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, [
    currentPage,
    debouncedSearchValue,
    skip,
    refetch,
    filters,
    searchQuery,
    authToken,
  ]);

  return (
    <>
      <AddTaskModal
        open={open}
        setOpen={setOpen}
        refetch={refetch}
        setRefetch={setReftech}
        taskDataToEdit={taskToEdit}
      />
      <Navbar />
      <Header open={open} setOpen={setOpen} />
      <div className='container mx-auto px-4 mt-5'>
        <div className='lg:flex lg:justify-between'>
          <SearchBar onSearch={handleSearch} />

          <div className='mt-5 lg:items-end flex lg:ml-4 lg:mt-0'>
            <Select
              label={'status'}
              options={STATUS_LIST}
              filters={filters}
              setFilters={setFilters}
            />
            <Select
              label={'priority'}
              options={PRIORITIES}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      <TaskList
        taskData={tasks}
        handleTaskDelete={handleTaskDelete}
        handleTaskEdit={handleTaskEdit}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    </>
  );
}
