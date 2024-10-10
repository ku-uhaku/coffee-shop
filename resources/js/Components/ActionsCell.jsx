import React from 'react';
import Dropdown from '@/Components/Dropdown';
import { FaChevronDown } from 'react-icons/fa';

const ActionsCell = ({ actions, triggerText = "Actions", triggerIcon = <FaChevronDown /> }) => {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {triggerText}
          {triggerIcon && <span className="w-4 h-4 ml-2 -mr-1 text-gray-400">{triggerIcon}</span>}
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className="py-1">
          {actions.map((action, index) => (
            action.type === 'separator' ? (
              <hr key={index} className="my-1 border-t border-gray-200" />
            ) : (
              <Dropdown.Link 
                key={index}
                href={action.href} 
                method={action.method || 'get'}
                as="button"
                onClick={action.onClick}
                className={`flex items-center px-4 py-2 text-sm ${action.className || 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                {action.icon && <span className="inline mr-2">{action.icon}</span>}
                {action.label}
              </Dropdown.Link>
            )
          ))}
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default ActionsCell;