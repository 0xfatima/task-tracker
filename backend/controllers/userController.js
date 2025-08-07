const Task = require("../models/Task");
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// @desc GET all users (admin only)
// @route GET /api/users
// @access Private (Admin)

const getUsers = async (req, res) =>{
    try{
        const users = await User.find({role:"member"}).select("-password");

        //add task counts to each user
        const usersWithTaksCounts = await Promise.all(
            users.map(async(user)=>{
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                const inProgressTasks = await await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In progress",
                });
                const completedTasks = await await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                });
            })
        )

    }catch(error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};

// @desc GET users by ID
// @route GET /api/users/:id
// @access Private

const getUserById = async (req, res) =>{
    try{
        const user = await User.findById(req.params.id).select("-password")
        if(!user) return res.status(404).json({message:"User not found"});
        res.json(user);
    }catch(error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};

// @desc DELETE user (admin only)
// @route DELETE /api/users/:id
// @access Private(Admin)

// const deleteUser = async (req, res) =>{
//     try{

//     }catch(error){
//         res.status(500).json({message:"Server error", error: error.message})
//     }
// };


module.exports = {getUsers, getUserById}