import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Progress, } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const StudentTables = ({ assignmentData, reportData, isLoading }) => {
    const [assignmentPage, setAssignmentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const rowsPerPage = 5;

    // Pagination calculations for assignments
    const assignmentStartIndex = (assignmentPage - 1) * rowsPerPage;
    const assignmentEndIndex = assignmentStartIndex + rowsPerPage;
    const totalAssignmentPages = assignmentData
        ? Math.ceil(assignmentData.assignments.length / rowsPerPage)
        : 0;

    // Pagination calculations for reports
    const reportStartIndex = (reportPage - 1) * rowsPerPage;
    const reportEndIndex = reportStartIndex + rowsPerPage;
    const totalReportPages = reportData
        ? Math.ceil(reportData.report.length / rowsPerPage)
        : 0;


    const renderPagination = (currentPage, totalPages, setPage) => (
        <div className="flex items-center justify-end gap-4 border-t border-blue-gray-50 p-4">
            <button
                disabled={currentPage === 1}
                onClick={() => setPage(current => Math.max(1, current - 1))}
                className="px-4 py-2 text-sm text-blue-gray-700 hover:bg-blue-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
                Previous
            </button>
            <span className="text-sm text-blue-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                className="px-4 py-2 text-sm text-blue-gray-700 hover:bg-blue-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
                Next
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <Card className="h-[400px] animate-pulse bg-blue-gray-100 border border-blue-gray-100 shadow-sm" />
                </div>
                <Card className="h-[400px] animate-pulse bg-blue-gray-100 border border-blue-gray-100 shadow-sm" />
            </div>
        );
    }

    return (
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Assignments Table */}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 flex items-center justify-between p-6"
                >
                    <div>
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                            Assignments
                        </Typography>
                        <Typography
                            variant="small"
                            className="flex items-center gap-1 font-normal text-blue-gray-600"
                        >
                            <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                            {assignmentData?.assignments.length || 0} total assignments
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Assignment", "Lecturer", "Submitted at", "Grade"].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-medium uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentData?.assignments.slice(assignmentStartIndex, assignmentEndIndex).map((assignment, key) => {
                                const className = `py-3 px-5 ${key === rowsPerPage - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={assignment.id}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {assignment.title}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {assignment.lecturer}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {assignment.submissionStatus}
                                            </Typography>
                                        </td>

                                        <td className={className}>
                                            <div className="w-10/12">
                                                <Typography
                                                    variant="small"
                                                    className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                >
                                                    {assignment.grade}%
                                                </Typography>
                                                <Progress
                                                    value={assignment.grade}
                                                    variant="gradient"
                                                    color={assignment.grade === 100 ? "green" : "blue"}
                                                    className="h-1"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {renderPagination(assignmentPage, totalAssignmentPages, setAssignmentPage)}
                </CardBody>
            </Card>

            {/* Reports Table */}
            <Card className="border border-blue-gray-100 shadow-sm">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 p-6"
                >
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                        Reports Overview
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Comment", "Lecturer"].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-medium uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reportData?.report.slice(reportStartIndex, reportEndIndex).map((report, key) => {
                                const className = `py-3 px-5 ${key === rowsPerPage - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={report.id}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {report.report_text}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {report.lecturer.name}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                    {renderPagination(reportPage, totalReportPages, setReportPage)}
                </CardBody>
            </Card>
        </div>
    );
};

export default StudentTables;