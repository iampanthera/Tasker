import { Fragment, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { toast, ToastContainer } from 'react-toastify';

import { useCookies } from 'react-cookie';

import { createTask, editTask } from '../api/taskApi';

import { Options } from '../interface/Options';
import { Task } from '../interface/Task';

import { PRIORITIES } from '../constants/priority';
import { STATUS_LIST } from '../constants/status';
import Filters from './Filters';

interface AddTaskModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  taskDataToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  setOpen,
  refetch,
  setRefetch,
  taskDataToEdit,
}) => {
  const cancelButtonRef = useRef(null);

  const [cookies] = useCookies(['authToken']);
  const authToken = cookies.authToken;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<Options>(STATUS_LIST[0]);
  const [priority, setPriority] = useState<Options>(PRIORITIES[3]);
  const [tags, setTags] = useState<string[]>([]);
  const [dateInput, setDateInput] = useState<Date>(new Date());
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
  };

  const toggleRefetch = () => {
    setRefetch(!refetch);
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        title: title,
        description: description,
        dueDate: dateInput,
        status: status.value,
        priority: priority.value,
        tags,
      };
      const newTask = await createTask(taskData, authToken);
      console.log('New task created:', newTask);
      notify();
      toggleRefetch();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async () => {
    try {
      const taskData = {
        title: title,
        description: description,
        dueDate: dateInput,
        status: status.value,
        priority: priority.value,
        tags,
      };
      const updatedTask = await editTask(
        taskDataToEdit!._id,
        taskData,
        authToken
      );
      console.log('Task updated:', updatedTask);
      toast.success('Success Notification !');
      toggleRefetch();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const notify = () => {
    toast.success('Success Notification !');
  };

  const resetState = () => {
    setTitle('');
    setDescription('');
    setStatus(STATUS_LIST[0]);
    setPriority(PRIORITIES[3]);
    setTags([]);
    setDateInput(new Date());
    setInputValue('');
  };

  useEffect(() => {
    if (taskDataToEdit) {
      setTitle(taskDataToEdit.title || '');
      setDescription(taskDataToEdit.description || '');
      setStatus(
        STATUS_LIST.find((status) => status.value === taskDataToEdit.status) ||
          STATUS_LIST[0]
      );
      setPriority(
        PRIORITIES.find(
          (priority) => priority.value === taskDataToEdit.priority
        ) || PRIORITIES[0]
      );
      setTags([...taskDataToEdit.tags] || []);
      setDateInput(new Date(taskDataToEdit.dueDate));
    }
  }, [taskDataToEdit]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-scroll rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl '>
                  <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='sm:flex sm:items-start'>
                      <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                        <Dialog.Title
                          as='h3'
                          className='text-base font-semibold leading-6 text-gray-900'
                        >
                          Add Task
                        </Dialog.Title>
                        <div className='mt-1'>
                          <div className='mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                            <div className='sm:col-span-4'>
                              <label
                                htmlFor='title'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Title
                              </label>
                              <div className='mt-2'>
                                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                                  <input
                                    type='text'
                                    name='title'
                                    id='title'
                                    autoComplete='title'
                                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                                    value={title}
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className='col-span-full'>
                              <label
                                htmlFor='description'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Description
                              </label>
                              <div className='mt-2'>
                                <textarea
                                  id='description'
                                  name='description'
                                  rows={3}
                                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                  value={description}
                                  onChange={(e) => {
                                    setDescription(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='mt-4'>
                          <label
                            htmlFor='description'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Priority
                          </label>

                          <Filters
                            optionsList={PRIORITIES}
                            optionSelected={priority}
                            handleOption={setPriority}
                          />
                        </div>
                        <div className='mt-4'>
                          <label
                            htmlFor='description'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Status
                          </label>

                          <Filters
                            optionsList={STATUS_LIST}
                            optionSelected={status}
                            handleOption={setStatus}
                          />
                        </div>
                        <div className='mt-4'>
                          <label
                            htmlFor='description'
                            className='block text-sm font-medium leading-6 text-gray-900'
                          >
                            Tags
                          </label>
                          <div className='flex flex-wrap gap-2 border rounded-md p-2'>
                            {tags.map((tag, index) => (
                              <div
                                key={index}
                                className='bg-blue-500 text-white px-2 py-1 rounded-md flex items-center'
                              >
                                {tag}
                                <button
                                  type='button'
                                  className='ml-2 focus:outline-none'
                                  onClick={() => handleTagDelete(tag)}
                                >
                                  &#10005;
                                </button>
                              </div>
                            ))}
                            <input
                              type='text'
                              placeholder='Add tags...'
                              value={inputValue}
                              onChange={handleInputChange}
                              onKeyDown={handleInputKeyDown}
                              className='outline-none border-none flex-grow'
                            />
                          </div>
                          <div className='mt-4'>
                            <label
                              htmlFor='title'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Date
                            </label>
                            <div className='mt-2'>
                              <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                                <input
                                  type='date'
                                  name='title'
                                  id='title'
                                  autoComplete='title'
                                  className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                                  value={dateInput.toISOString().split('T')[0]}
                                  onChange={(e) => {
                                    setDateInput(new Date(e.target.value));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                      onClick={() => {
                        setOpen(false);
                        taskDataToEdit ? handleEditTask() : handleCreateTask();
                      }}
                    >
                      {taskDataToEdit ? 'Update' : 'Add'}
                    </button>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ToastContainer />
    </>
  );
};

export default AddTaskModal;
