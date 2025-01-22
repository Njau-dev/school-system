import React from 'react';
import { Typography, Chip, Progress, IconButton } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { EyeIcon } from "@heroicons/react/24/outline";

const columnConfigs = {
    student: [
        { header: 'Assignment', key: 'title' },
        { header: 'Submitted At', key: 'submittedAt' },
        { header: 'Status', key: 'graded' },
        { header: 'Grade', key: 'grade' },
        { header: '', key: 'actions' }
    ],
    lecturer: [
        { header: 'Student', key: 'studentName' },
        { header: 'Submitted At', key: 'submittedAt' },
        { header: 'Status', key: 'graded' },
        { header: 'Grade', key: 'grade' },
        { header: '', key: 'actions' }
    ],
    admin: [
        { header: 'Student', key: 'studentName' },
        { header: 'Submitted At', key: 'submittedAt' },
        { header: 'Status', key: 'graded' },
        { header: 'Grade', key: 'grade' },
        { header: '', key: 'actions' }
    ]
};

const SubmissionTable = ({ role, data }) => {
    const columns = columnConfigs[role] || columnConfigs.student;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

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
                {data.map((submission, index) => {
                    const className = `py-3 px-5 ${index === data.length - 1 ? "" : "border-b border-blue-gray-50"
                        }`;

                    return (
                        <tr key={submission.id}>
                            {columns.map((column) => (
                                <td key={`${submission.id}-${column.key}`} className={className}>
                                    {column.key === 'title' ? (
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {submission.assignment?.title}
                                        </Typography>
                                    ) : column.key === 'submittedAt' ? (
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {formatDate(submission.submittedAt || submission.submitted_at)}
                                        </Typography>
                                    ) : column.key === 'graded' ? (
                                        <Chip
                                            variant="gradient"
                                            color={submission.graded ? "green" : "blue-gray"}
                                            value={submission.graded ? "Graded" : "Ungraded"}
                                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                        />
                                    ) : column.key === 'grade' ? (
                                        <div className="w-10/12">
                                            <Typography className="text-xs font-semibold text-blue-gray-600 mb-1">
                                                {submission.grade || '0'}%
                                            </Typography>
                                            <Progress
                                                value={submission.grade || 0}
                                                variant="gradient"
                                                color={submission.graded ? "green" : "blue-gray"}
                                                className="h-1"
                                            />
                                        </div>
                                    ) : column.key === 'actions' ? (
                                        <Link to={`/submissions/details/${submission.id}`}>
                                            <IconButton variant="text" color="blue-gray">
                                                <EyeIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Link>
                                    ) : (
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {submission[column.key]}
                                        </Typography>
                                    )}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SubmissionTable;