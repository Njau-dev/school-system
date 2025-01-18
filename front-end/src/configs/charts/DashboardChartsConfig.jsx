import { chartsConfig } from "./ChartsConfig";

// Student Dashboard Charts
const studentGradesByAssignment = {
    type: "bar",
    height: 220,
    series: [
        {
            name: "Grade",
            data: [], // Will be populated with grades
        },
    ],
    options: {
        ...chartsConfig,
        colors: "#3b82f6", // Blue
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 5,
            },
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: [], // Will be populated with assignment titles
        },
        yaxis: {
            ...chartsConfig.yaxis,
            max: 100, // Since we're dealing with grades
        },
    },
};

const studentGradesTrend = {
    type: "line",
    height: 220,
    series: [
        {
            name: "Grade",
            data: [], // Will be populated with grades over time
        },
    ],
    options: {
        ...chartsConfig,
        colors: ["#6366f1"], // Indigo
        stroke: {
            lineCap: "round",
        },
        markers: {
            size: 5,
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: [], // Will be populated with dates
        },
        yaxis: {
            ...chartsConfig.yaxis,
            max: 100,
        },
    },
};

// Lecturer Dashboard Charts
const assignmentGradesDistribution = {
    type: "bar",
    height: 220,
    series: [
        {
            name: "Average Grade",
            data: [], // Will be populated with average grades
        },
    ],
    options: {
        ...chartsConfig,
        colors: "#10b981", // Emerald
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 5,
            },
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: [], // Will be populated with assignment titles
        },
    },
};

const submissionRatesPie = {
    type: "pie",
    height: 220,
    series: [], // Will be populated with [completed, pending] counts
    options: {
        ...chartsConfig,
        colors: ["#10b981", "#f43f5e"], // Emerald and Rose
        labels: ["Completed", "Pending"],
        legend: {
            position: "bottom",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
    },
};

// Admin Dashboard Charts
const assignmentsOverTime = {
    type: "line",
    height: 220,
    series: [
        {
            name: "Assignments",
            data: [], // Will be populated with assignment counts
        },
    ],
    options: {
        ...chartsConfig,
        colors: ["#8b5cf6"], // Violet
        stroke: {
            lineCap: "round",
        },
        markers: {
            size: 5,
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: [], // Will be populated with dates
        },
    },
};

const userRolesPie = {
    type: "pie",
    height: 220,
    series: [], // Will be populated with role counts
    options: {
        ...chartsConfig,
        colors: ["#8b5cf6", "#3b82f6", "#10b981"], // Violet, Blue, Emerald
        labels: ["Admins", "Lecturers", "Students"],
        legend: {
            position: "bottom",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
    },
};

// Export chart configurations by role
export const studentChartsData = [
    {
        color: "white",
        title: "Grades by Assignment",
        description: "Your grades for each assignment",
        chart: studentGradesByAssignment,
    },
    {
        color: "white",
        title: "Grade Trend",
        description: "Your grade progression over time",
        chart: studentGradesTrend,
    },
];

export const lecturerChartsData = [
    {
        color: "white",
        title: "Assignment Grade Distribution",
        description: "Average grades per assignment",
        chart: assignmentGradesDistribution,
    },
    {
        color: "white",
        title: "Submission Status",
        description: "Student submission completion rate",
        chart: submissionRatesPie,
    },
];

export const adminChartsData = [
    {
        color: "white",
        title: "Assignment Creation Trend",
        description: "Number of assignments created over time",
        chart: assignmentsOverTime,
    },
    {
        color: "white",
        title: "User Distribution",
        description: "Distribution of users by role",
        chart: userRolesPie,
    },
];