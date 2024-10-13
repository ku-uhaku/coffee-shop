import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import logo from "../../../public/images/logo/logo.png";

import {
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
    BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: UserCircleIcon,
        route: 'dashboard',
    },
    {
        name: 'Users',
        icon: PresentationChartBarIcon,
        children: [
            { name: 'Create User', route: 'admin.users.create' },
            { name: 'List Users', route: 'admin.users' },
        ],
    },
    {
        name: 'Store',
        icon: BuildingStorefrontIcon,
        children: [
            { name: 'Store', route: 'admin.store' },
           
        ],
    },
   
];

export default function Sidebar({ isOpen }) {
    const [openAccordions, setOpenAccordions] = useState({});
    const { url } = usePage();

    const isActive = (path) => url.startsWith(path);


    const shouldOpenAccordion = (item) => {
        return item.children && item.children.some(child => isActive(route(child.route)));
    };

    useEffect(() => {
        const newOpenAccordions = {};
        sidebarItems.forEach((item, index) => {
            if (shouldOpenAccordion(item)) {
                newOpenAccordions[index] = true;
            }
        });
        setOpenAccordions(newOpenAccordions);
    }, [url]);

    const handleAccordionToggle = (index) => {
        setOpenAccordions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const renderSidebarItem = (item, index) => {
        const Icon = item.icon;

        if (item.children) {
            return (
                <Accordion
                    key={index}
                    open={openAccordions[index]}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${
                                openAccordions[index] ? "rotate-180" : ""
                            }`}
                        />
                    }
                >
                    <ListItem className={`p-0 ${openAccordions[index] ? 'bg-blue-gray-50 text-blue-gray-900' : ''}`}>
                        <AccordionHeader
                            onClick={() => handleAccordionToggle(index)}
                            className="border-b-0 p-3"
                        >
                            <ListItemPrefix>
                                <Icon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                {item.name}
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            {item.children.map((child, childIndex) => (
                                <Link key={childIndex} href={route(child.route)}>
                                    <ListItem className={`relative ${isActive(route(child.route)) ? 'bg-blue-gray-50 text-blue-gray-900' : ''}`}>
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        {child.name}
                                        {isActive(route(child.route)) && <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>}
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </AccordionBody>
                </Accordion>
            );
        } else {
            return (
                <Link key={index} href={route(item.route)} method={item.method || 'get'} as={item.method ? 'button' : 'a'}>
                    <ListItem className={`relative ${isActive(route(item.route)) ? 'bg-blue-gray-50 text-blue-gray-900' : ''}`}>
                        <ListItemPrefix>
                            <Icon className="h-5 w-5" />
                        </ListItemPrefix>
                        {item.name}
                        {isActive(route(item.route)) && <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>}
                    </ListItem>
                </Link>
            );
        }
    };

    return (
        <div
            className={`transition-all duration-300 bg-slate-800 text-white ${
                isOpen ? "w-64" : "w-0"
            }`}
            style={{ overflow: "hidden" }}
        >
            <div className="mb-2 p-2 flex justify-center">
                <img src={logo} alt="logo" className="w-32" />
            </div>
            <List>
                {sidebarItems.map((item, index) => renderSidebarItem(item, index))}
            </List>
        </div>
    );
}
