import React, { useEffect, useState } from 'react';
import DashboardCards from '../../layouts/DashboardCards';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LecturerCharts from './charts/LecturerCharts';
import LecturerTables from '../../layouts/LecturerTables';

const LecturerDashboard = () => {
    const [data, setData] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { role, backendUrl, token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}${role}/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to fetch dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

                setStudentData(assignmentsResponse.data);
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
                data={data}
                isLoading={isLoading}
            />
            <LecturerCharts
                data={chartsData}
                isLoading={isLoading}
            />

            <LecturerTables
                studentData={studentData}
                reportData={reportData}
                isLoading={isLoading}
            />
        </>
    );
};

export default LecturerDashboard;