import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Checkbox, Button, Typography } from '@material-tailwind/react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const Register = () => {

    const { backendUrl } = useAuth();

    // Local state to handle form data
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        termsAccepted: false,
    });

    const navigate = useNavigate();

    // Update formData state on input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Function to handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            toast.error("You must accept the Terms and Conditions!");
            return;
        }

        try {
            // API call
            const response = await axios.post(`${backendUrl}register`, {
                name: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 201) {
                toast.success(response.data.message);

                setTimeout(() => {
                    navigate("signin");
                }, 3000);
            }


        } catch (error) {
            // Handle errors and show error message
            toast.error(
                error.response.data.error.message
            );
        }

    };

    return (
        <section className="m-8 flex">
            <div><Toaster /></div>
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="src/assets/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
            <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
                </div>
                <form
                    onSubmit={handleRegister}
                    className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    <div className="mb-1 flex flex-col gap-6">

                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            User name
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name"
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />

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
                    <Button type='submit' className="mt-6" fullWidth>
                        Register Now
                    </Button>

                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Already have an account?
                        <Link to="/signin" className="text-gray-900 ml-1">Sign in</Link>
                    </Typography>
                </form>

            </div>
        </section>
    )
}

export default Register
