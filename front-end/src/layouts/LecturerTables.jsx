import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Progress,
} from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const LecturerTables = ({ studentData, reportData, isLoading }) => {
    const [studentPage, setStudentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const rowsPerPage = 5;

    // Pagination calculations
    const studentStartIndex = (studentPage - 1) * rowsPerPage;
    const studentEndIndex = studentStartIndex + rowsPerPage;
    const totalStudentPages = studentData ? Math.ceil(studentData.students.length / rowsPerPage) : 0;

    const reportStartIndex = (reportPage - 1) * rowsPerPage;
    const reportEndIndex = reportStartIndex + rowsPerPage;
    const totalReportPages = reportData ? Math.ceil(reportData.reports.length / rowsPerPage) : 0;

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
            {/* Students Table */}
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 flex items-center justify-between p-6"
                >
                    <div>
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                            Students Overview
                        </Typography>
                        <Typography
                            variant="small"
                            className="flex items-center gap-1 font-normal text-blue-gray-600"
                        >
                            <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                            {studentData?.students.length || 0} total students
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Student Name", "Assignment Completion", "Average Grade"].map((el) => (
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
                            {studentData?.students.slice(studentStartIndex, studentEndIndex).map((student, key) => {
                                const className = `py-3 px-5 ${key === rowsPerPage - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={student.id}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {student.name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="w-10/12">
                                                <Typography
                                                    variant="small"
                                                    className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                >
                                                    {student.completionRate}%
                                                </Typography>
                                                <Progress
                                                    value={student.completionRate}
                                                    variant="gradient"
                                                    color={student.completionRate === 100 ? "green" : "blue"}
                                                    className="h-1"
                                                />
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <div className="w-10/12">
                                                <Typography
                                                    variant="small"
                                                    className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                >
                                                    {student.averageGrade}%
                                                </Typography>
                                                <Progress
                                                    value={student.averageGrade}
                                                    variant="gradient"
                                                    color={student.averageGrade >= 70 ? "green" : "blue"}
                                                    className="h-1"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {renderPagination(studentPage, totalStudentPages, setStudentPage)}
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
                        Recent Reports
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Student Name", "Comment"].map((el) => (
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
                            {reportData?.reports.slice(reportStartIndex, reportEndIndex).map((report, key) => {
                                const className = `py-3 px-5 ${key === rowsPerPage - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={report.id}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {report.student.name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {report.report_text}
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

export default LecturerTables;