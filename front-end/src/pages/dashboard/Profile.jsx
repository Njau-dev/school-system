import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react'
import React from 'react'

const Profile = () => {
    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('./assets/img/background-image.png')] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-4">
                    <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src="src/assets/img/student.jpeg"
                                alt="profile"
                                size="xl"
                                variant="rounded"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                            <div>
                                <Typography variant="h5" color="blue-gray" className="mb-1">
                                    {/* user name */}
                                    Uzui Tengen
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-normal text-blue-gray-600"
                                >
                                    {/* user role */}
                                    Hashira
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default Profile
