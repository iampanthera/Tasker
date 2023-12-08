import { PlusIcon } from "@heroicons/react/20/solid";

interface NavbarProps {
  open: boolean;
  setOpen: (value: boolean) => void; // Setter function for boolean state
}

const Header: React.FC<NavbarProps> = ({ open, setOpen }) => {
  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Task Management
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setOpen(true)}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Task
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
