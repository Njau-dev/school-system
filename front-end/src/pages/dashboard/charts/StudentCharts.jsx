import React from 'react';
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { studentChartsData } from '../../../configs/charts/DashboardChartsConfig';
import StatisticsChart from '../../../layouts/StatisticCharts';

const StudentCharts = ({ data, isLoading }) => {
    // Transform API data for the charts
    const transformData = () => {
        if (!data) return studentChartsData;

        const transformed = [...studentChartsData];

        // Transform for Grades by Assignment chart
        transformed[0].chart.series[0].data = data.grades || [];
        transformed[0].chart.options.xaxis.categories = data.assignments || [];

        // Transform for Grade Trend chart
        transformed[1].chart.series[0].data = data.gradeTrend || [];
        transformed[1].chart.options.xaxis.categories = data.dates || [];

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

// Expected data shape
StudentCharts.PropTypes = {
    data: PropTypes.shape({
        grades: PropTypes.arrayOf(PropTypes.number),
        assignments: PropTypes.arrayOf(PropTypes.string),
        gradeTrend: PropTypes.arrayOf(PropTypes.number),
        dates: PropTypes.arrayOf(PropTypes.string),
    }),
    isLoading: PropTypes.bool,
};

export default StudentCharts;