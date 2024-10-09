import React from 'react';

export function Tabs({ children, activeTab, onTabChange }) {
	return (
		<div className="mb-6">
			<div className="flex space-x-1 rounded-xl bg-gray-200 p-1">
				{React.Children.map(children, (child, index) => (
					<div
						key={index}
						className={`w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium leading-5 transition-all duration-200 ${
							activeTab === index
								? 'bg-white text-blue-700 shadow-sm'
								: 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
						}`}
						onClick={() => onTabChange(index)}
					>
						{child.props.label}
					</div>
				))}
			</div>
			<div className="mt-6 rounded-xl bg-white p-4 shadow-md">
				{React.Children.toArray(children)[activeTab]}
			</div>
		</div>
	);
}

export function Tab({ children }) {
	return <div className="text-gray-800">{children}</div>;
}
