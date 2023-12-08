import { Dialog } from '@headlessui/react';
import { PRIORITIES } from '../../../constants/priority';
import { STATUS_LIST } from '../../../constants/status';
import Filters from '../../Shared/Filters';

const TaskForm = ({
  formik,
  setOpen,
  cancelButtonRef,
  isUpdate,
  inputValue,
  onInputValueChange,
  resetInput,
}: any) => {
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      const updatedTags = [...formik.values.tags, inputValue.trim()];
      formik.setFieldValue('tags', updatedTags);
      resetInput();
    }
  };

  return (
    <form>
      <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
        <div className='sm:flex sm:items-start'>
          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
            <Dialog.Title
              as='h3'
              className='text-base font-semibold leading-6 text-gray-900'
            >
              {isUpdate ? 'Add Task' : 'Edit Task'}
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
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>
                  {formik.touched.title && formik.errors.title && (
                    <div className='text-red-500'>{formik.errors.title}</div>
                  )}
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
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <label
                htmlFor='priority'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Priority
              </label>

              <Filters
                optionsList={PRIORITIES}
                optionSelected={formik.values.priority}
                handleOption={(option) =>
                  formik.setFieldValue('priority', option)
                }
              />
            </div>
            <div className='mt-4'>
              <label
                htmlFor='status'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Status
              </label>

              <Filters
                optionsList={STATUS_LIST}
                optionSelected={formik.values.status}
                handleOption={(option) =>
                  formik.setFieldValue('status', option)
                }
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
                {formik.values.tags.map((tag: any, index: any) => (
                  <div
                    key={index}
                    className='bg-blue-500 text-white px-2 py-1 rounded-md flex items-center'
                  >
                    {tag}
                    <button
                      type='button'
                      className='ml-2 focus:outline-none'
                      onClick={() => {
                        const updatedTags = [...formik.values.tags];
                        updatedTags.splice(index, 1);
                        formik.setFieldValue('tags', updatedTags);
                      }}
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
                <input
                  type='text'
                  placeholder='Add tags...'
                  value={inputValue}
                  onChange={onInputValueChange}
                  onKeyDown={handleInputKeyDown}
                  className='outline-none border-none flex-grow'
                />
              </div>
              <div className='mt-4'>
                <label
                  htmlFor='dueDate'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Date
                </label>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                    <input
                      type='date'
                      name='dueDate'
                      id='dueDate'
                      className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                      value={
                        formik.values.dueDate !== ''
                          ? formik?.values?.dueDate
                              ?.toISOString()
                              ?.split('T')[0]
                          : new Date().toISOString()?.split('T')[0]
                      }
                      onChange={(e) =>
                        formik.setFieldValue(
                          'dueDate',
                          new Date(e.target.value)
                        )
                      }
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className='text-red-500'>{formik.errors.firstName}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
        <button
          type='submit'
          className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
          onClick={formik.handleSubmit}
        >
          {isUpdate ? 'Update' : 'Add'}
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
    </form>
  );
};

export default TaskForm;
