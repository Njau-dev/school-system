import React from 'react';
import { Typography, Chip, Avatar, IconButton } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { EyeIcon } from "@heroicons/react/24/outline";

// Column configurations for each role
const columnConfigs = {
    student: [
        { header: 'Title', key: 'title' },
        { header: 'Lecturer', key: 'lecturer' },
        { header: 'Created At', key: 'createdAt' },
        { header: 'Status', key: 'submissionStatus' },
        { header: '', key: 'actions' }
    ],
    lecturer: [
        { header: 'Title', key: 'title' },
        { header: 'Created At', key: 'createdAt' },
        { header: 'Completion', key: 'hasSubmitted' },
        { header: 'Submission %', key: 'submissionPercentage' },
        { header: '', key: 'actions' }
    ],
    admin: [
        { header: 'Title', key: 'title' },
        { header: 'Created At', key: 'createdAt' },
        { header: 'Lecturer', key: 'lecturer' },
        { header: 'Submission %', key: 'submissionPercentage' },
        { header: '', key: 'actions' }
    ]
};

const AssignmentTable = ({ role, data }) => {
    const columns = columnConfigs[role] || columnConfigs.student;

    return (
        <table className="w-full min-w-[640px] table-auto">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                        >
                            <Typography
                                variant="small"
                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                            >
                                {column.header}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {
                    data.map((assignment, index) => {
                        const className = `py-3 px-5 ${index === data.length - 1 ? '' : 'border-b border-blue-gray-50'}`;

                        return (
                            <tr key={assignment.id}>
                                {columns.map((column) => (
                                    <td key={`${assignment.id}-${column.key}`} className={className}>
                                        {column.key === 'submissionStatus' ? (
                                            <Chip
                                                variant="gradient"
                                                color={assignment.submissionStatus === 'submitted' ? 'green' : 'blue-gray'}
                                                value={assignment.submissionStatus}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        ) : column.key === 'hasSubmitted' ? (
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {`${assignment[column.key]}`}
                                            </Typography>
                                        ) : (
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {assignment[column.key]}
                                            </Typography>
                                        )}
                                    </td>
                                ))}

                                {/* Add the view button column */}
                                <td className={className}>
                                    <Link to={`/assignments/${assignment.id}`}>
                                        <IconButton variant="text" color="blue-gray">
                                            <EyeIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
};

export default AssignmentTable;