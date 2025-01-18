import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SubmissionTable from '../../layouts/SubmissionsTable';

const Submissions = () => {
    const { role, backendUrl, token } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${backendUrl}${role}/submissions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSubmissions(response.data.submissions);
            } catch (error) {
                console.error('Error fetching submissions:', error);
                toast.error('Error fetching submissions')
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [role, backendUrl, token]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Submissions
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <SubmissionTable role={role} data={submissions} />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default Submissions;