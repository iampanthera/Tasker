import React from 'react';

import { Options } from '../../interface/Options';

interface SelectProps {
  label: string;
  options: Options[];
  filters: { status: string; priority: number };
  setFilters: (value: { status: string; priority: number }) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  filters,
  setFilters,
}) => {
  return (
    <div className='ml-2'>
      <select
        className='block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        onChange={(e) => {
          setFilters({ ...filters, [label]: e.target.value });
        }}
      >
        <option selected>Filter By {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
