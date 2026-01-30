import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav className="text-sm text-gray-500">
            <ol className="list-none p-0 inline-flex">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.href ? (
                            <Link to={item.href} className="hover:text-primary">{item.label}</Link>
                        ) : (
                            <span className="text-gray-700">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
