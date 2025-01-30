import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Progress, Avatar, Textarea, } from '@material-tailwind/react';
import { CalendarDaysIcon, UserIcon, EnvelopeIcon, DocumentArrowDownIcon, AcademicCapIcon, ClipboardDocumentCheckIcon, PencilSquareIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import toast from 'react-hot-toast';

const SubmissionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role, backendUrl, token } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gradeDialog, setGradeDialog] = useState(false);
    const [grading, setGrading] = useState(false);
    const [gradeData, setGradeData] = useState({
        grade: '',
        comment: ''
    });
    const [downloadLink, setDownloadLink] = useState(null)

    useEffect(() => {
        const fetchSubmission = async () => {
            setLoading(true);
            try {
                const endpoint = role === 'student'
                    ? `${backendUrl}submission/student/${id}`
                    : `${backendUrl}submission/lecturer/${id}`;

                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubmission(response.data.submission);
                setDownloadLink(response.data.downloadLink)

                // Fetch assignment details after getting submission
                const assignmentResponse = await axios.get(
                    `${backendUrl}assignment/${response.data.submission.assignment_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAssignment(assignmentResponse.data);
            } catch (error) {
                console.error('Error fetching details:', error);
                toast.error(error.response?.data?.message || 'Error fetching submission details');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id, backendUrl, token, role]);

    const handleGradeSubmit = async () => {
        if (!gradeData.grade || !gradeData.comment) {
            toast.error('Please provide both grade and comment');
            return;
        }

        const grade = Number(gradeData.grade);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error('Grade must be a number between 0 and 100');
            return;
        }

        setGrading(true);
        try {
            await axios.put(
                `${backendUrl}submissions/${id}`,
                gradeData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Submission graded successfully');
            setGradeDialog(false);
            navigate('/submissions');
        } catch (error) {
            console.error('Error grading submission:', error);
            toast.error(error.response?.data?.message || 'Error grading submission');
        } finally {
            setGrading(false);
        }
    };

    const getGradeColor = (grade) => {
        if (!grade) return 'blue-gray';
        if (grade <= 50) return 'red';
        if (grade <= 75) return 'yellow';
        return 'green';
    };

    const handleFileDownload = () => {
        const cleanDownloadLink = downloadLink.startsWith('/') ? downloadLink.slice(1) : downloadLink;
        const finalUrl = `${backendUrl}${cleanDownloadLink}`;
        window.open(finalUrl, '_blank');
    };

    if (loading || !submission || !assignment) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
    );

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <div className="container mx-auto -mt-16 px-4 py-8">
                <Card className="max-w-[800px] mx-auto">
                    <CardBody className="p-6">
                        {/* Assignment Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-500" />
                                <Typography variant="h4" color="blue-gray">
                                    Assignment Details
                                </Typography>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Typography variant="h6" color="blue-gray">Title:</Typography>
                                    <Typography>{assignment.title}</Typography>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Typography variant="h6" color="blue-gray">Description:</Typography>
                                    <Typography className="text-gray-700">{assignment.description}</Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography className="text-sm text-blue-gray-500">
                                        Created on {new Date(assignment.createdAt).toLocaleDateString()}
                                    </Typography>
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
                                            <EnvelopeOpenIcon className="h-4 w-4 text-blue-gray-600" />
                                            <Typography variant="small" className="text-blue-gray-600">
                                                {assignment.lecturer.email}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Submission Section */}
                        <div className="border-t border-blue-gray-100 pt-6">
                            <div className="flex items-center gap-3 mb-6">
                                <AcademicCapIcon className="h-6 w-6 text-blue-500" />
                                <Typography variant="h4" color="blue-gray">
                                    Submission Details
                                </Typography>
                            </div>
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography className="text-sm text-blue-gray-500">
                                        Submitted on {new Date(submission.submitted_at).toLocaleDateString()}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src="/img/student.jpeg"
                                        alt={submission.student.name}
                                        size="md"
                                        variant="rounded"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-blue-gray-500" />
                                            <Typography>{submission.student.name}</Typography>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="h-5 w-5 text-blue-gray-500" />
                                            <Typography>{submission.student.email}</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="h6" color="blue-gray">Grade: {submission.grade}%</Typography>
                                    <Progress
                                        value={submission.grade || 0}
                                        size="md"
                                        variant='gradient'
                                        color={getGradeColor(submission.grade)}
                                    // label={submission.grade ? `${submission.grade}%` : "Not graded"}
                                    />
                                </div>
                                {submission.comment && (
                                    <div className="space-y-2">
                                        <Typography variant="h6" color="blue-gray">Feedback:</Typography>
                                        <Typography className="text-gray-700">{submission.comment}</Typography>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <Button
                                        variant="gradient"
                                        color="gray"
                                        className="flex items-center gap-2"
                                        onClick={handleFileDownload}
                                    >
                                        <DocumentArrowDownIcon className="h-5 w-5" />
                                        <span className='hidden md:block'>View Submission</span>
                                    </Button>
                                    {role === 'lecturer' && !submission.graded && (
                                        <Button
                                            variant="gradient"
                                            color="blue"
                                            className="flex items-center gap-2"
                                            onClick={() => setGradeDialog(true)}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                            <span className='hidden md:block'>Grade Submission</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                {/* Grading Dialog */}
                <Dialog open={gradeDialog} handler={() => setGradeDialog(false)}>
                    <DialogHeader>Grade Submission</DialogHeader>
                    <DialogBody>
                        <div className="space-y-4">
                            <div>
                                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                    Grade (0-100)
                                </Typography>
                                <Input
                                    type="number"
                                    value={gradeData.grade}
                                    onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                                    className="!border-blue-gray-200 focus:!border-blue-500"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </div>
                            <div>
                                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                    Feedback Comment
                                </Typography>
                                <Textarea
                                    value={gradeData.comment}
                                    onChange={(e) => setGradeData({ ...gradeData, comment: e.target.value })}
                                    className="!border-blue-gray-200 focus:!border-blue-500"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setGradeDialog(false)}
                            className="mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={handleGradeSubmit}
                            disabled={grading}
                            className="flex items-center gap-2"
                        >
                            {grading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900 border-t-transparent" />
                            ) : (
                                <PencilSquareIcon className="h-4 w-4" />
                            )}

                            {grading ? 'Submitting...' : 'Submit Grade'}
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    );
};

export default SubmissionDetails;