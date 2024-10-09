import React, { useState } from "react"

export function Tab({ children }) {
	return <div>{children}</div>
}

export function Tabs({ children }) {
	const [activeTab, setActiveTab] = useState(0)

	return (
		<div className="bg-white rounded-lg">
			<div className="flex border-b border-gray-200">
				{React.Children.map(children, (child, index) => (
					<button
						key={index}
						className={`py-3 px-6 font-medium text-sm transition-colors duration-200 ${
							activeTab === index
								? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
								: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
						}`}
						onClick={() => setActiveTab(index)}
					>
						{child.props.label}
					</button>
				))}
			</div>
			<div className=" py-4">{React.Children.toArray(children)[activeTab]}</div>
		</div>
	)
}
