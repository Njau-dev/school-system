import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';
import axios from 'axios';
import AssignmentTable from '../../layouts/AssignmentTable';
import { getAssignments } from '../../configs/services/AssignmentServices';
import toast from 'react-hot-toast';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Assignments = () => {
    const { role, backendUrl, token } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const data = await getAssignments(backendUrl, role, token);
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                toast.error('Error fetching assignments')
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [role, backendUrl, token]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between">
                    <Typography variant="h6" color="white">
                        Assignments Table
                    </Typography>

                    {role === 'lecturer' &&
                        <Link to='/addassignment'>
                            <DocumentPlusIcon className='h-7' />
                        </Link>
                    }
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <AssignmentTable role={role} data={assignments} />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default Assignments;