import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Checkbox, Button, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {

    const { logIn, backendUrl } = useAuth();
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);

    // Local state to handle form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        termsAccepted: false,
        forgotPasswordEmail: ""
    });

    // Update formData state on input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true)
        if (!formData.termsAccepted) {
            toast.error("You must accept the Terms and Conditions!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}login`, {
                email: formData.email,
                password: formData.password,
            });

            const token = response.data.accessToken

            if (response.status === 200) {
                toast.success(response.data.message);
                logIn(token)

            }

        } catch (error) {
            // Handle errors and show error message
            toast.error(error.response.data.error.message);
        } finally {
            setLoading(false);
        }

    };

    // Function to handle forgot password
    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}forgot-password`, {
                email: formData.forgotPasswordEmail,
            });

            if (response.status === 200) {
                toast.success(response.data.message);
            }

        } catch (error) {
            // Handle errors and show error message
            toast.error(error.response.data.error.message);
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    };

    return (
        <section className="m-8 flex gap-4">
            <div><Toaster /></div>

            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
                </div>
                <form onSubmit={handleLogin} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Your email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <Checkbox
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center justify-start font-medium"
                            >
                                I agree the&nbsp;
                                <a
                                    href="#"
                                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                                >
                                    Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{ className: "-ml-2.5" }}
                    />

                    <Button type='submit' className="mt-6 flex justify-center gap-2" fullWidth>
                        {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-50 border-t-transparent" />
                        ) : ('')
                        }
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="flex items-center justify-between gap-2 mt-6">
                        <Checkbox
                            label={
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center justify-start font-medium"
                                >
                                    Subscribe me to newsletter
                                </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />
                        <Typography variant="small" className="font-medium text-gray-900">
                            <a href="#" onClick={() => setOpenDialog(true)}>
                                Forgot Password
                            </a>
                        </Typography>
                    </div>
                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Not registered?
                        <Link to="/signup" className="text-gray-900 ml-1">Create account</Link>
                    </Typography>
                </form>

            </div>
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />

            </div>

            {/* Forgot Password Dialog */}
            <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
                <DialogHeader>Forgot Password</DialogHeader>
                <DialogBody>
                    <Typography variant="paragraph" color="blue-gray" className="mb-4">
                        Please enter your email address. We will send you an email to reset your password.
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="name@mail.com"
                        name='forgotPasswordEmail'
                        value={formData.forgotPasswordEmail}
                        onChange={handleChange}
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
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
                        onClick={handleForgotPassword}
                        className='flex flex-row-reverse gap-2'
                    >
                        {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-50 border-t-transparent" />
                        ) : ('')
                        }
                        {loading ? 'Sending Email...' : 'Send Email'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </section>
    );
}

export default Login