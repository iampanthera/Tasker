import { Fragment, SetStateAction, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { PRIORITIES } from '../../../constants/priority';
import { STATUS_LIST } from '../../../constants/status';
import { createTask, editTask } from '../../../api/taskApi';
import { Task } from '../../../interface/Task';
import TaskForm from './TaskForm';

interface AddTaskModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  taskDataToEdit?: Task | null;
}

const taskValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  dueDate: Yup.date(),
  tags: Yup.array()
    .of(Yup.string())
    .max(5, 'Exceeded the maximum number of tags (5)'),
});

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
  const [inputValue, setInputValue] = useState('');

  const formik = useFormik({
    initialValues: {
      title: taskDataToEdit?.title || '',
      description: taskDataToEdit?.description || '',
      priority: taskDataToEdit?.priority
        ? PRIORITIES.find(
            (priority) => priority.value === taskDataToEdit.priority
          )!
        : PRIORITIES[3],
      status: taskDataToEdit?.status
        ? STATUS_LIST.find((status) => status.value === taskDataToEdit.status)!
        : STATUS_LIST[0],
      tags: taskDataToEdit?.tags || [],
      dueDate: taskDataToEdit?.dueDate ? new Date(taskDataToEdit.dueDate) : '',
    },
    enableReinitialize: true,
    validationSchema: taskValidationSchema,
    onSubmit: async (values: any) => {
      const objToSend = {
        ...values,
        status: values.status.value,
        priority: values.priority.value,
      };

      try {
        if (taskDataToEdit?._id) {
          await editTask(taskDataToEdit!._id, objToSend, authToken);
          toast.success('Task Updated successfully!');
        } else {
          await createTask(objToSend, authToken);
          toast.success('Task Created successfully!');
        }
      } catch (error) {
        console.error('Error handling form submission:', error);
      } finally {
        setOpen(false);
        formik.resetForm();
        setRefetch(!refetch);
      }
    },
  });

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const resetInput = () => {
    setInputValue('');
  };

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
                  <TaskForm
                    formik={formik}
                    setOpen={setOpen}
                    isUpdate={!!taskDataToEdit?._id}
                    inputValue={inputValue}
                    onInputValueChange={handleInputChange}
                    resetInput={resetInput}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default AddTaskModal;
