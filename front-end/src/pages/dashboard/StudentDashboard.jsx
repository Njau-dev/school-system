import React, { useEffect, useState } from 'react';
import DashboardCards from '../../layouts/DashboardCards';
import StudentCharts from './charts/StudentCharts';
// import StudentTables from './tables/StudentTables';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import StudentTables from '../../layouts/StudentTables';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [assignmentData, setAssignmentData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { role, backendUrl, token } = useAuth();

    // Fetch dashboard cards data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}${role}/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to fetch dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Fetch charts data
    useEffect(() => {
        const loadChartsData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}${role}/charts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChartsData(response.data);
            } catch (error) {
                toast.error('Failed to load charts data');
            } finally {
                setIsLoading(false);
            }
        };
        loadChartsData();
    }, []);

    // Fetch table data (assignments and reports)
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                setIsLoading(true);
                const [assignmentsResponse, reportsResponse] = await Promise.all([
                    axios.get(`${backendUrl}${role}/tables`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${backendUrl}${role}/reports`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                ]);

                setAssignmentData(assignmentsResponse.data);
                setReportData(reportsResponse.data);
            } catch (error) {
                console.error('Error fetching table data:', error);
                toast.error('Failed to fetch table data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTableData();
    }, []);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
    );

    return (
        <>
            <DashboardCards
                role={role}
                data={dashboardData}
                isLoading={isLoading}
            />
            <StudentCharts
                data={chartsData}
                isLoading={isLoading}
            />
            <StudentTables
                assignmentData={assignmentData}
                reportData={reportData}
                isLoading={isLoading}
            />
        </>
    );
};

export default StudentDashboard;