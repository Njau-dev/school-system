import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, CalendarDaysIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import UserTable from '../../components/UserTable';

const Profile = () => {
    const { token, backendUrl } = useAuth();
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allUsersLoading, setAllUsersLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${backendUrl}getuser`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Profile fetch error:', error);
                toast.error(error.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [token, backendUrl]);


    // Add this useEffect for fetching all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            if (user?.role === 'admin') {
                setAllUsersLoading(true);
                try {
                    const response = await axios.get(`${backendUrl}getallusers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAllUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    toast.error(error.response?.data?.message || 'Failed to load users');
                } finally {
                    setAllUsersLoading(false);
                }
            }
        };

        fetchAllUsers();
    }, [user?.role, token, backendUrl]);

    // Add these handler functions
    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await axios.patch(
                `${backendUrl}updateuser/${userId}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAllUsers(users => users.map(user =>
                user.user_id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error('Role update failed:', error);
            throw error;
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${backendUrl}deleteuser/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAllUsers(users => users.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    };

    const roleAvatars = {
        admin: 'public/img/admin.jpeg',
        lecturer: 'public/img/lecturer.jpeg',
        student: 'public/img/student.jpeg'
    };

    if (loading || !user) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
    );

    if (!user) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load profile data. Please try refreshing the page.
            </div>
        );
    }

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('public/img/background-image.png')] bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>

            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-4">
                    <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={roleAvatars[user.role]}
                                alt="profile"
                                size="xl"
                                variant="rounded"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                            <div>
                                <Typography variant="h4" color="blue-gray" className="mb-2">
                                    Profile Details
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'lecturer' ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <UserCircleIcon className="h-6 w-6 text-blue-500" />
                                <Typography variant="h5" color="blue-gray">
                                    Personal Information
                                </Typography>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography color="blue-gray" className="">
                                        {user.name}
                                    </Typography>

                                </div>
                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography className="text-blue-gray-700">
                                        {user.email}
                                    </Typography>
                                </div>


                            </div>
                        </div>

                        {/* Account Timeline Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <CalendarDaysIcon className="h-6 w-6 text-blue-500" />
                                <Typography variant="h5" color="blue-gray">
                                    Account Timeline
                                </Typography>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography className="text-blue-gray-700">
                                        Joined on {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500" />
                                    <Typography className="text-blue-gray-700">
                                        Last updated on {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Table Section - Visible only for Admin */}
                    {user.role === 'admin' && (
                        <div className="mt-12 border-t border-blue-gray-100 pt-8">
                            <Typography variant="h4" color="blue-gray" className="mb-6">
                                User Management
                            </Typography>

                            {allUsersLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                </div>
                            ) : (
                                <UserTable
                                    users={allUsers.sort((a, b) =>
                                        ['admin', 'lecturer', 'student'].indexOf(a.role) -
                                        ['admin', 'lecturer', 'student'].indexOf(b.role)
                                    )}
                                    onUpdate={handleRoleUpdate}
                                    onDelete={handleDeleteUser}
                                />
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
};

export default Profile;