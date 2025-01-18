export const chartsConfig = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    title: {
        show: "",
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        labels: {
            style: {
                colors: "#37474f",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: 300,
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#37474f",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: 300,
            },
        },
    },
    grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
            lines: {
                show: true,
            },
        },
        padding: {
            top: 5,
            right: 20,
        },
    },
    fill: {
        opacity: 0.8,
    },
    tooltip: {
        theme: "dark",
    },
};

// Common chart settings that can be extended
export const commonChartSettings = {
    bar: {
        columnWidth: "40%",
        borderRadius: 5,
        distributed: false,
    },
    line: {
        stroke: {
            curve: 'smooth',
            lineCap: "round",
            width: 3,
        },
        markers: {
            size: 5,
            strokeWidth: 0,
        },
    },
    pie: {
        donut: {
            size: '65%',
            labels: {
                show: true,
                total: {
                    show: true,
                    fontSize: '16px',
                    fontWeight: 600,
                },
            },
        },
        labels: {
            show: true,
        },
    },
};

export default chartsConfig;