import React, { useState } from 'react';
import { Avatar, IconButton, Typography, Select, Option, Button, Dialog } from '@material-tailwind/react';
import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const UserTable = ({ users, onUpdate, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingUser, setDeletingUser] = useState(null);
    const [changingRole, setChangingRole] = useState(null);
    const itemsPerPage = 10;

    // Pagination calculations
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRoleChangeConfirmation = async () => {
        try {
            await onUpdate(changingRole.userId, changingRole.newRole);
            toast.success('Role updated successfully');
        } catch (error) {
            toast.error('Failed to update role');
        } finally {
            setChangingRole(null);
        }
    };

    const confirmDelete = async () => {
        try {
            await onDelete(deletingUser);
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeletingUser(null);
        }
    };

    return (
        <div className="mt-8">
            <div className="overflow-x-scroll">
                <table className="w-full min-w-[640px] table-auto">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            {['User', 'Email', 'Role', 'Last Updated', 'Actions'].map((header) => (
                                <th key={header} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                        {header}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {paginatedUsers.map((user, index) => {
                            const isLast = index === paginatedUsers.length - 1;
                            const className = `py-3 px-5 ${!isLast ? 'border-b border-blue-gray-50' : ''}`;

                            return (
                                <tr key={user.user_id}>
                                    {/* User Cell */}
                                    <td className={className}>
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={`/src/assets/img/${user.role}.jpeg`}
                                                alt={user.name}
                                                size="sm"
                                                variant="rounded"
                                            />
                                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                                {user.name}
                                            </Typography>
                                        </div>
                                    </td>

                                    {/* Email Cell */}
                                    <td className={className}>
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {user.email}
                                        </Typography>
                                    </td>

                                    {/* Role Cell */}
                                    <td className={className}>
                                        <Select
                                            size="sm"
                                            value={user.role}
                                            onChange={(newRole) => setChangingRole({
                                                userId: user.user_id,
                                                newRole,
                                                currentRole: user.role
                                            })}
                                            className="capitalize"
                                        >
                                            {['admin', 'lecturer', 'student'].map((role) => (
                                                <Option key={role} value={role} className="capitalize">
                                                    {role}
                                                </Option>
                                            ))}
                                        </Select>
                                    </td>

                                    {/* Last Updated Cell */}
                                    <td className={className}>
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {new Date(user.updatedAt).toLocaleDateString()}
                                        </Typography>
                                    </td>

                                    {/* Actions Cell */}
                                    <td className={className}>
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            onClick={() => setDeletingUser(user.user_id)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                    <Button
                        variant="text"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    <Typography className="font-medium text-blue-gray-600">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                        variant="text"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Role Change Confirmation Dialog */}
            <Dialog open={!!changingRole} onClose={() => setChangingRole(null)}>
                <div className="p-6 text-center">
                    <CheckIcon className="mx-auto h-8 w-8 text-blue-500 mb-4" />
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Confirm Role Change
                    </Typography>

                    {changingRole && (
                        <div className="mb-4">
                            <Typography className="text-sm">
                                Change role from {' '}
                                <span className="font-bold text-blue-500">
                                    {changingRole.currentRole}
                                </span> to {' '}
                                <span className="font-bold text-green-500">
                                    {changingRole.newRole}
                                </span>?
                            </Typography>
                            <Typography variant="small" className="text-red-500 mt-2">
                                Note: This will immediately modify user's permissions!
                            </Typography>
                        </div>
                    )}

                    <div className="flex justify-center gap-3">
                        <Button variant="text" onClick={() => setChangingRole(null)}>
                            Cancel
                        </Button>
                        <Button
                            color="green"
                            onClick={handleRoleChangeConfirmation}
                            disabled={!changingRole}
                        >
                            Confirm Change
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deletingUser} onClose={() => setDeletingUser(null)}>
                <div className="p-6 text-center">
                    <XMarkIcon className="mx-auto h-8 w-8 text-red-500 mb-4" />
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Confirm Delete
                    </Typography>
                    <Typography className="mb-4">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Typography>
                    <div className="flex justify-center gap-3">
                        <Button variant="text" onClick={() => setDeletingUser(null)}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={confirmDelete}>
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default UserTable;