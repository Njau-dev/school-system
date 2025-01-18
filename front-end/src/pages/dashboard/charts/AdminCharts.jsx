import React from 'react';
import { Typography } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { adminChartsData } from '../../../configs/charts/DashboardChartsConfig';
import StatisticsChart from '../../../layouts/StatisticCharts';

const AdminCharts = ({ data, isLoading }) => {
    // Transform API data for the charts
    const transformData = () => {
        if (!data) return adminChartsData;

        const transformed = [...adminChartsData];

        // Transform for Assignments Over Time line chart
        transformed[0].chart.series[0].data = data.assignmentCounts || [];
        transformed[0].chart.options.xaxis.categories = data.timeLabels || [];

        // Transform for User Distribution pie chart
        transformed[1].chart.series = [
            data.adminCount || 0,
            data.lecturerCount || 0,
            data.studentCount || 0
        ];

        return transformed;
    };

    const chartsData = transformData();

    if (isLoading) {
        return (
            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
                <div className="h-[400px] animate-pulse bg-blue-gray-100"></div>
                <div className="h-[400px] animate-pulse bg-blue-gray-100"></div>
            </div>
        );
    }

    return (
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
            {chartsData.map((props) => (
                <StatisticsChart
                    key={props.title}
                    {...props}
                    footer={
                        <Typography
                            variant="small"
                            className="flex items-center font-normal text-blue-gray-600"
                        >
                            <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                            &nbsp;{props.footer || 'Updated just now'}
                        </Typography>
                    }
                />
            ))}
        </div>
    );
};

export default AdminCharts;