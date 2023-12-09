import { SetStateAction, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Header from '../../components/Task/Header';
import AddTaskModal from '../../components/Task/TaskModal.tsx';
import TaskList from '../../components/Task/TaskList';
import Pagination from '../../components/Shared/Pagination';
import Navbar from '../../components/Shared/Navbar';

import { getAllTask, deleteTask } from '../../api/taskApi';

import useDebounce from '../../hooks/useDebounce';

import { Task } from '../../interface/Task';
import FilterBar from '../../components/Task/FilterBar';

export default function Home() {
  const [refetch, setReftech] = useState(false);
  const [open, setOpen] = useState(false);

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

  const [cookies] = useCookies(['authToken']);
  const authToken = cookies.authToken;

  const handleSearch = (query: SetStateAction<string>) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpen(true);
  };

  const resetEditTask = () => setTaskToEdit(null);

  const handleTaskDelete = async (id: string) => {
    try {
      await deleteTask(id, authToken);
      setReftech(!refetch);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
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
      <FilterBar
        handleSearch={handleSearch}
        filters={filters}
        setFilters={setFilters}
      />
      <TaskList
        taskData={tasks}
        handleTaskDelete={handleTaskDelete}
        handleTaskEdit={handleTaskEdit}
        onResetEditTask={resetEditTask}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    </>
  );
}
