import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, Typography, Avatar, Chip, IconButton, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { CalendarDaysIcon, UserIcon, EnvelopeIcon, EyeIcon, TrashIcon, CloudArrowUpIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import toast from 'react-hot-toast';


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
];

const AssignmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role, backendUrl, token } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const fileInputRef = useRef(null);

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
            await axios.delete(`${backendUrl}assignments/${id}`, {
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

    //file handling
    const validateFile = (file) => {
        if (!file) return 'Please select a file';
        if (!allowedFileTypes.includes(file.type)) {
            return 'Invalid file type. Please upload PDF, Word, Text, or Markdown files.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 10MB limit';
        }
        return null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateFile(file);
            if (error) {
                toast.error(error);
                e.target.value = null;
                setSelectedFile(null);
            } else {
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        const error = validateFile(selectedFile);
        if (error) {
            toast.error(error);
            return;
        }

        setSubmitLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`${backendUrl}submit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Assignment submitted successfully');
            setOpenSubmitDialog(false);
            navigate('/submissions');
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error(error.response?.data?.message || 'Error submitting assignment');
        } finally {
            setSubmitLoading(false);
        }
    };


    if (loading || !assignment) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
    );

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className='p-4'>
                    {/* Assignment Info Section */}
                    <div className="mb-12">
                        <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
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
                                src="/img/lecturer.jpeg"
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
                                <Button
                                    color="gray"
                                    variant="gradient"
                                    className="px-6"
                                    onClick={() => setOpenSubmitDialog(true)}
                                >
                                    Submit Assignment
                                </Button>
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
                                                                src="/img/student.jpeg"
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
                                                            <Link to={`/submissions`}>
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

                {/* Submit Assignment Dialog */}
                <Dialog
                    open={openSubmitDialog}
                    handler={() => {
                        setOpenSubmitDialog(false);
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }}
                    className="min-w-[80%] md:min-w-[60%] lg:min-w-[40%]"
                >
                    <DialogHeader className="flex items-center gap-3">
                        <CloudArrowUpIcon className="h-6 w-6 text-blue-500" />
                        Submit Assignment
                    </DialogHeader>
                    <DialogBody>
                        <div className="flex flex-col gap-4">
                            <Typography color="gray" className="text-sm">
                                Please upload your assignment file. Accepted formats: PDF, Word, Text, or Markdown.
                                Maximum file size: 10MB.
                            </Typography>

                            <div className="w-full p-4 border border-dashed border-blue-gray-200 rounded-lg">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept={allowedFileTypes.join(',')}
                                    className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                                />
                            </div>

                            {selectedFile && (
                                <div className="flex items-center gap-2 text-sm text-blue-gray-600">
                                    <DocumentPlusIcon className="h-4 w-4" />
                                    {selectedFile.name}
                                </div>
                            )}
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => {
                                setOpenSubmitDialog(false);
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className="mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={handleSubmit}
                            disabled={submitLoading || !selectedFile}
                            className="flex items-center gap-2"
                        >
                            {submitLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <CloudArrowUpIcon className="h-4 w-4" />
                            )}
                            {submitLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </Dialog>

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