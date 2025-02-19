import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Typography } from '@material-tailwind/react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {

    const { backendUrl } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Local state to handle form data
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    // Update formData state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Function to handle form submission
    const handleResetPassword = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}reset-password`, {
                token: window.location.pathname.split('/')[2],
                password: formData.newPassword,
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/signin');
            }

        } catch (error) {
            // Handle errors and show error message
            toast.error(error.response.data.error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="m-8 flex gap-4">
            <div><Toaster /></div>

            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Reset Password</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and new password to reset your password.</Typography>
                </div>
                <form onSubmit={handleResetPassword} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    <div className="mb-1 flex flex-col gap-6">

                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            New Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            name='newPassword'
                            value={formData.newPassword}
                            onChange={handleChange}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Confirm Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>

                    <Button type='submit' className="mt-6 flex justify-center gap-2" fullWidth>
                        {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-50 border-t-transparent" />
                        ) : ('')
                        }
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>

                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Remembered your password?
                        <Link to="/signin" className="text-gray-900 ml-1">Sign In</Link>
                    </Typography>
                </form>

            </div>
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
        </section>
    );
}

export default ResetPassword