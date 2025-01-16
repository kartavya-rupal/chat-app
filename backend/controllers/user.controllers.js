




import expressAsyncHandler from "express-async-handler";
import { User } from "../models/user.models.js";
import generateToken from "../config/generateToken.js";

const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    })
    if (existedUser) {
        res.status(409)
        throw new Error("User with email or username already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar,
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Failed to create user")
    }
})

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const user = await User.findOne({ email })
    if (user && (await user.isPasswordCorrect(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

const getAllUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

export {
    registerUser,
    loginUser,
    getAllUsers
}
