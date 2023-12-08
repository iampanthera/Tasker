import SearchBar from '../Shared/SearchBar';
import Select from '../Shared/Select';
import { STATUS_LIST } from '../../constants/status';
import { PRIORITIES } from '../../constants/priority';

function FilterBar({
  handleSearch,
  filters,
  setFilters,
}: {
  handleSearch: any;
  filters: any;
  setFilters: any;
}) {
  return (
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
  );
}

export default FilterBar;
