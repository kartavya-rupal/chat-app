import { FormControl, FormLabel, Input, VStack, Button, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'


const Signup = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const navigate = useNavigate()

    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const handleClick = () => setShowPassword(!showPassword)

    const toast = useToast()
    const [avatar, setAvatar] = useState()
    const [picLoading, setPicLoading] = useState(false)
    const postDetails = (pic) => {
        setPicLoading(true)
        if (pic === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "chatApp")
            data.append("cloud_name", "kartavyarupal")
            fetch("https://api.cloudinary.com/v1_1/kartavyarupal/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setAvatar(data.url.toString())
                    console.log(data.url.toString())
                    setPicLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setPicLoading(false)
                })
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false)
            return;
        }
    }

    const submitHandler = async () => {
        setPicLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false)
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {
                    name,
                    email,
                    password,
                    avatar,
                },
                config
            );
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setPicLoading(false)
            navigate("/chats")
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setPicLoading(false)
        }
    }

    return <VStack spacing='5px' >
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
                type='email'
                placeholder='Enter Your Email Address'
                onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="confirmpassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="avatar">
            <FormLabel>Upload your Avatar</FormLabel>
            <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={picLoading}
        >
            Sign Up
        </Button>
    </VStack>
}

export default Signup
