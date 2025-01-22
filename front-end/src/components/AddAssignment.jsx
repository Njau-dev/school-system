import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Card,
    CardBody,
    Typography,
    Input,
    Textarea,
    Button,
} from '@material-tailwind/react';
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import toast from 'react-hot-toast';

const AddAssignment = () => {
    const navigate = useNavigate();
    const { backendUrl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${backendUrl}addassignment`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Assignment created successfully');
            navigate('/assignments');
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error(error.response?.data?.message || 'Error creating assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('./assets/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className='p-4'>
                    <div className="max-w-[800px] mx-auto">
                        <Card className="hover:shadow-lg transition-shadow duration-300 mb-6">
                            <CardBody className="py-6 px-10 mb-3">
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="rounded-xl bg-blue-gray-50 p-3">
                                        <DocumentPlusIcon className="h-6 w-6 text-blue-gray-800" />
                                    </div>
                                    <div>
                                        <Typography variant="h3" className="text-blue-gray-800">
                                            Create New Assignment
                                        </Typography>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="mb-2 font-medium"
                                        >
                                            Assignment Title
                                        </Typography>
                                        <Input
                                            type="text"
                                            name="title"
                                            placeholder="Enter assignment title"
                                            className="!border-blue-gray-200 focus:!border-blue-500"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="w-full">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="mb-2 font-medium"
                                        >
                                            Description
                                        </Typography>
                                        <Textarea
                                            name="description"
                                            placeholder="Enter assignment description"
                                            className="!border-blue-gray-200 focus:!border-blue-500"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            variant="gradient"
                                            color="gray"
                                            className="flex items-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            ) : (
                                                <DocumentPlusIcon className="h-5 w-5" />
                                            )}
                                            {loading ? 'Creating...' : 'Create Assignment'}
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default AddAssignment;