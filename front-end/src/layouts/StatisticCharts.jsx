import { Card, CardHeader, CardBody, CardFooter, Typography, } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";

export function StatisticsChart({ color, chart, title, description, footer }) {
    return (
        <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
                <Chart
                    {...chart}
                    width="100%"
                    height={chart.series[0]?.data?.length === 0 ? 100 : chart.height}
                />
            </CardHeader>
            <CardBody className="px-6 pt-0">
                <Typography variant="h6" color="blue-gray">
                    {title}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    {description}
                </Typography>
            </CardBody>
            {footer && (
                <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}

StatisticsChart.defaultProps = {
    color: "blue",
    footer: null,
};

StatisticsChart.propTypes = {
    color: PropTypes.oneOf([
        "white",
        "blue-gray",
        "gray",
        "brown",
        "deep-orange",
        "orange",
        "amber",
        "yellow",
        "lime",
        "light-green",
        "green",
        "teal",
        "cyan",
        "light-blue",
        "blue",
        "indigo",
        "deep-purple",
        "purple",
        "pink",
        "red",
    ]),
    chart: PropTypes.shape({
        height: PropTypes.number,
        series: PropTypes.array,
        options: PropTypes.object,
        type: PropTypes.string,
    }).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    footer: PropTypes.node,
};

export default StatisticsChart;