import React from 'react'
import { forwardRef } from 'react'

const Select = forwardRef(({ className = '', children, ...props }, ref) => {
    return (
        <select
            {...props}
            ref={ref}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
        >
            {children}
        </select>
    )
})

export default Select
