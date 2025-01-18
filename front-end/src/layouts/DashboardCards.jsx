import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { AcademicCapIcon, ChartBarIcon, ClipboardIcon, ClockIcon, DocumentIcon, InboxIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';

// Base StatCard component for reuse
const StatCard = ({ icon, title, value, footer, color = 'gray' }) => {
    return (
        <Card className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
            <CardHeader
                variant="gradient"
                color={color}
                floated={false}
                shadow={true}
                className="absolute grid h-12 w-12 place-items-center"
            >
                {icon}
            </CardHeader>
            <CardBody className="p-4 text-right">
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    {title}
                </Typography>
                <Typography variant="h4" color="blue-gray">
                    {value}
                </Typography>
            </CardBody>
            {footer && (
                <CardFooter className="border-t border-blue-gray-50 p-4">
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
};

// Dashboard Cards Section
const DashboardCards = ({ role, data, isLoading }) => {
    if (isLoading) {
        return <div className="mt-12">Loading...</div>;
    }

    // Configure cards based on role
    const getCardsConfig = () => {
        switch (role) {
            case 'student':
                return [
                    {
                        title: "Student Details",
                        value: data?.studentName || "N/A",
                        icon: <UserIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Assignments",
                        value: data?.totalAssignments || 0,
                        icon: <DocumentIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Submissions",
                        value: `${data?.totalSubmissions || 0}/${data?.totalAssignments || 0}`,
                        icon: <ClipboardIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Average Grade",
                        value: data?.averageGrade || "N/A",
                        icon: <AcademicCapIcon className="h-6 w-6 text-white" />,
                    },
                ];
            case 'lecturer':
                return [
                    {
                        title: "Total Students",
                        value: data?.totalStudents || 0,
                        icon: <UsersIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Assignments",
                        value: data?.totalAssignments || 0,
                        icon: <DocumentIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Pending Reviews",
                        value: data?.pendingReviews || 0,
                        icon: <ClockIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Reports",
                        value: data?.totalReports || 0,
                        icon: <ChartBarIcon className="h-6 w-6 text-white" />,
                    },
                ];
            case 'admin':
                return [
                    {
                        title: "Total Lecturers",
                        value: data?.totalLecturers || 0,
                        icon: <UsersIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Students",
                        value: data?.totalStudents || 0,
                        icon: <UserGroupIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Assignments",
                        value: data?.totalAssignments || 0,
                        icon: <DocumentIcon className="h-6 w-6 text-white" />,
                    },
                    {
                        title: "Total Submissions",
                        value: data?.totalSubmissions || 0,
                        icon: <InboxIcon className="h-6 w-6 text-white" />,
                    },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="mt-12">
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {getCardsConfig().map((card, index) => (
                    <StatCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        footer={card.footer}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardCards;