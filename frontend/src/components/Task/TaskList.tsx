import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

import { Task } from '../../interface/Task';
import { PRIORITIES } from '../../constants/priority';

interface TaskListProps {
  taskData: Task[];
  handleTaskDelete: (id: string) => void;
  handleTaskEdit: (task: Task) => void;
  onResetEditTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  taskData,
  handleTaskDelete,
  handleTaskEdit,
  onResetEditTask,
}) => {
  if (!taskData.length) {
    return (
      <div className='flex justify-center items-center h-96'>
        <p className='text-2xl text-gray-400'>No tasks found</p>
      </div>
    );
  }

  const confirmDelete = (taskId: string) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (isConfirmed) {
      handleTaskDelete(taskId);
      onResetEditTask();
    }
  };

  return (
    <div className='container mx-auto px-4'>
      <ul className='divide-y divide-gray-100'>
        {taskData.map((task, index) => (
          <li key={index} className='flex justify-between gap-x-6 py-5'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900'>
                {task.title}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {task.description}
              </p>
              <p className='mt-1 text-xs leading-5 text-gray-500'>
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <div className='flex mt-1'>
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className='inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-2'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
              <button
                type='button'
                className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50'
                onClick={() => {
                  handleTaskEdit(task);
                }}
              >
                <PencilIcon
                  className='-ml-0.5 mr-1.5 h-5 w-5 text-blue-500'
                  aria-hidden='true'
                />
                Edit
              </button>
              <button
                type='button'
                className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50'
                onClick={() => confirmDelete(task._id)}
              >
                <TrashIcon
                  className='-ml-0.5 mr-1.5 h-5 w-5 text-red-500'
                  aria-hidden='true'
                />
                Delete
              </button>

              <div className='flex mt-2'>
                <div
                  className={` text-xs mr-2 ${getPriorityClass(
                    task.priority
                  )} border border-solid rounded px-1 py-1`}
                >
                  {PRIORITIES.find(
                    (priority) => priority.value === task.priority
                  )?.name || 'Unknown Priority'}
                </div>
                <div
                  className={`text-xs ${getStatusClass(
                    task.status
                  )} border border-solid rounded px-1 py-1`}
                >
                  {task.status}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

const getPriorityClass = (priorityValue: number): string => {
  switch (priorityValue) {
    case 5:
      return 'text-red-600 border-red-600 '; // For Critical - Red color
    case 4:
      return 'text-yellow-600 border-yellow-600 '; // For High - Yellow color
    case 3:
      return 'text-blue-600 border-blue-600 '; // For Medium - Blue color
    case 2:
      return 'text-green-600 border-green-600 '; // For Low - Green color
    default:
      return 'text-gray-600 border-gray-600 '; // Default color for unknown priorities
  }
};

// Function to get CSS class based on status value
const getStatusClass = (statusValue: string): string => {
  switch (statusValue) {
    case 'pending':
      return 'text-yellow-600 border-yellow-600'; // For Pending - Yellow color
    case 'in progress':
      return 'text-blue-600 border-blue-600'; // For In Progress - Blue color
    case 'completed':
      return 'text-green-600 border-green-600'; // For Completed - Green color
    default:
      return 'text-gray-600 border-gray-600'; // Default color for unknown statuses
  }
};
