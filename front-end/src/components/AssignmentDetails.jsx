import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, Typography, Avatar, Chip, IconButton, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { CalendarDaysIcon, UserIcon, EnvelopeIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role, backendUrl, token } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${backendUrl}assignment/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAssignment(response.data);
                toast.success('Assignment details fetched successfully');
            } catch (error) {
                console.error('Error fetching assignment:', error);
                toast.error('Error fetching assignment details');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id, backendUrl, token]);


    const handleDelete = async () => {
        try {
            await axios.delete(`${backendUrl}assignment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Assignment deleted successfully');
            navigate('/assignments');
        } catch (error) {
            console.error('Error deleting assignment:', error);
            toast.error('Error deleting assignment');
        }
    };

    if (loading || !assignment) return <div>Loading...</div>;

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('./assets/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className='p-4'>
                    {/* Assignment Info Section */}
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <Typography variant="h3" color='blue-gray' className="mb-4 sm:mb-8 mt-3 text-2xl sm:text-3xl">
                                Assignment Details
                            </Typography>
                            {role === 'lecturer' && (
                                <Button
                                    color="red"
                                    variant="gradient"
                                    className="flex items-center gap-2 text-sm"
                                    onClick={() => setOpenDialog(true)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Delete Assignment
                                </Button>
                            )}
                        </div>

                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center mb-2'>
                            <Typography variant='h4' className='text-blue-gray-700 text-lg sm:text-xl'>Title:</Typography>
                            <Typography variant="h4" color="blue-gray" className="text-lg sm:text-xl">
                                {assignment.title}
                            </Typography>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center mb-6'>
                            <Typography variant='h5' className='text-blue-gray-700 text-base sm:text-lg'>Description:</Typography>
                            <Typography variant="h6" className="text-gray-600 text-base">
                                {assignment.description}
                            </Typography>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <Typography>Created at :</Typography>
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-blue-gray-600" />
                                <Typography variant="small" className="text-blue-gray-600">
                                    {new Date(assignment.createdAt).toLocaleDateString()}
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Avatar
                                src="/src/assets/img/lecturer.jpeg"
                                alt={assignment.lecturer.name}
                                size="md"
                                variant="rounded"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-blue-gray-600" />
                                    <Typography variant="small" className="font-semibold text-blue-gray-600">
                                        {assignment.lecturer.name}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <EnvelopeIcon className="h-4 w-4 text-blue-gray-600" />
                                    <Typography variant="small" className="text-blue-gray-600">
                                        {assignment.lecturer.email}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Add Submit Button for Students */}
                        {role === 'student' && (
                            <div className="flex justify-start mt-6">
                                <Link to={`/submit-assignment/${id}`}>
                                    <Button
                                        color="blue"
                                        variant="gradient"
                                        className="px-6"
                                    >
                                        Submit Assignment
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Submissions Table - Only for lecturer and admin */}
                    {(role === 'lecturer' || role === 'admin') && (
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                Student Submissions
                            </Typography>
                            <div className="overflow-x-scroll">
                                <table className="w-full min-w-[640px] table-auto">
                                    <thead>
                                        <tr>
                                            {["Student", "Email", "Status", "Grade Status", ""].map((el) => (
                                                <th
                                                    key={el}
                                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                                >
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                                    >
                                                        {el}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignment.students.map((student, index) => {
                                            const className = `py-3 px-5 ${index === assignment.students.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50"
                                                }`;

                                            return (
                                                <tr key={student.email}>
                                                    <td className={className}>
                                                        <div className="flex items-center gap-4">
                                                            <Avatar
                                                                src="/src/assets/img/student.jpeg"
                                                                alt={student.name}
                                                                size="sm"
                                                                variant="rounded"
                                                            />
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-semibold"
                                                            >
                                                                {student.name}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {student.email}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Chip
                                                            variant="gradient"
                                                            color={student.hasSubmitted ? "green" : "blue-gray"}
                                                            value={student.hasSubmitted ? "Submitted" : "Pending"}
                                                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                        />
                                                    </td>
                                                    <td className={className}>
                                                        <Chip
                                                            variant="gradient"
                                                            color={student.graded ? "green" : "blue-gray"}
                                                            value={student.graded ? "Graded" : "Ungraded"}
                                                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                        />
                                                    </td>
                                                    <td className={className}>
                                                        {student.hasSubmitted && (
                                                            <Link to={`/submissions/${id}`}>
                                                                <IconButton variant="text" color="blue-gray">
                                                                    <EyeIcon className="h-4 w-4" />
                                                                </IconButton>
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>


            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>
                    Are you sure you want to delete this assignment? This action cannot be undone.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setOpenDialog(false)}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={() => {
                            setOpenDialog(false);
                            handleDelete();
                        }}
                    >
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default AssignmentDetails;