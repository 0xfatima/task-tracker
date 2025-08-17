const Task = require("../models/Task");


const getTasks = async(req, res) =>{
    try{
        const {status} = req.query;
        let filter = {};

        if(status){
            filter.status = status;
        }

        let tasks = await Task.find({...filter, assignedTo:req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        // if(req.user.role ==="admin"){
        //     tasks = await Task.find(filter).populate(
        //         "assignedTo",
        //         "name email profileImageUrl"
        //     )
        // }else{
        //     tasks = await Task.find({...filter, assignedTo:req.user._id}).populate(
        //         "assignedTo",
        //         "name email profileImageUrl"
        //     );
        // }

        //add completed todochecklist count to each task

        tasks = await Promise.all(
            tasks.map(async(task)=>{
                const completedCount = task.todoChecklist.filter(
                    (item) =>item.completed
                ).length;
                return {...task._doc, completedTodoCount:completedCount};
            })
        );

        //Status summary counts
        // const allTasks = await Task.countDocuments(
        //     req.user.role === "admin"?{}:{assignedTo:req.user._id}
        // )

        const allTasks = await Task.countDocuments({ assignedTo: req.user._id });

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status:"Pending",
            assignedTo:req.user._id,
        })
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status:"In Progress",
            assignedTo:req.user._id,
        })

        const completedTasks = await Task.countDocuments({
            ...filter,
            status:"Completed",
           assignedTo:req.user._id,
        })


        res.json({
            tasks,
            statusSummary:{
                all:allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks, 
            }
        })
    }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

// @desc GET task by ID
// @route GET /api/tasks/:id
// @access Private

const getTaskById = async (req, res) =>{
        try{
            const task = await Task.findOne({
             _id: req.params.id,
                assignedTo: req.user._id    
                }).populate("assignedTo", "name email profileImageUrl");

            if(!task){
                return res.status(500).json({message: "Task not found"})
            }

            res.json(task)
                }catch(error){
        res.status(404).json({message:"Task not found", error:error.message})
    }
}

// @desc Create a new task (admin only)
// @route POST /api/tasks/
// @access Priavte (Admin)

const createTask = async (req, res) =>{
    console.log("task creation api called")
        try{
            const {title, description,priority, dueDate, assignedTo,attachments, todoChecklist} = req.body;
           
            const task = await Task.create({
                title,
                description,
                priority,
                dueDate, 
                assignedTo:req.user._id,
                createdBy:req.user._id,
                todoChecklist,
                attachments,
            });

            res.status(201).json({message:"task created successfully!", task})
        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}



// @desc Update task details
// @route PUT /api/tasks/:id
// @access Private

const updateTask = async(req, res) =>{
        try{
            const task = await Task.findById(req.params.id)
            if(!task){
                return res.status(500).json({message: "Task not found"})
            }

            task.title = req.body.title || task.title;
            task.description =  req.body.description || task.description;
            task.priority =  req.body.priority || task.priority;
            task.dueDate =  req.body.dueDate || task.dueDate;
            task.todoChecklist =  req.body.todoChecklist || task.todoChecklist;
            task.attachments =  req.body.attachments || task.attachments;

            if(req.body.assignedTo){
            task.assignedTo = req.body.assignedTo;
            }

            const upadtedtask = await task.save();
            res.json({message:"task updated successfully", upadtedtask})

        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

// @desc Delete a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private (admin)

const deleteTask = async (req,res) =>{
        try{
            const task= await Task.findById(req.params.id);
            if(!task) return res.status(404).json({message:"Task not found"})
            await task.deleteOne();
        res.json({message: "task deleted successfully"})
        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

// @desc update task status
// @route PUT /api/tasks/:id/status
// @access Private

const updateTaskStatus = async (req,res) =>{
        try{
            const task= await Task.findById(req.params.id);
            if(!task) return res.status(404).json({message:"Task not found"})

            const isAssigned = task.assignedTo.toString()=== req.user._id.toString();   
            ;

            if(!isAssigned){
                return res.status(403).json({message:"not authorized"})
            }
            task.status = req.body.status ||task.status;

            if(task.status === "Completed"){
                task.todoChecklist.forEach((item)=>(item.completed= true));
                task.progress = 100;
            }

            await task.save()
            res.json({message: "Task status updated", task})

        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

// @desc update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private

const updateTaskChecklist = async (req,res) =>{
        try{
            const {todoChecklist} = req.body;
            const task= await Task.findById(req.params.id);
            if(!task) return res.status(404).json({message:"Task not found"})

            if(task.assignedTo.toString()!== req.user._id.toString()){
                return res.status(403).json({message:"not authorized to update checklist"})
            }
            task.todoChecklist= todoChecklist

            const completedCount= task.todoChecklist.filter((item)=>item.completed).length;
            const totalItems = task.todoChecklist.length;
            task.progress = totalItems>0? Math.round((completedCount/totalItems)*100 ):0;

            //automark as completed if all tasks are checked
            if(task.progress===100){
                task.status = "Completed"
            }else if(task.progress>0){
                task.status = "In Progress"
            }else{
                task.status = "Pending"
            }

            await task.save();
            const updatedTask = await Task.findById(req.params.id).populate(
                "assignedTo",
                "name email profileImageUrl"
            )

            res.json({message: "task checklist updated", task:updatedTask});

        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

// @desc Dashboard data (admin only)
// @route Get /api/tasks/dashboard-data
// @access Private

// const getDashboardData = async (req,res) =>{
//         try{

//             //fetch statistics
//             const totalTasks = await Task.countDocuments();
//             const pendingTasks = await Task.countDocuments({status:"Pending"});
//             const completedTasks = await Task.countDocuments({status:"Completed"});
//             const overdueTasks = await Task.countDocuments({
//                 status:{$ne: "Completed"},
//                 dueDate:{$lt: new Date()}, 
//             });

//             //ensure all ossible statuses are included

//             const taskStatuses= ["Pending", "In Progress", "Completed"];
//             const taskDistributionRaw = await Task.aggregate([{
//                 $group:{
//                     _id:"$status",
//                     count:{$sum:1},
//                 }
//             }])

//             const taskDistribution= taskStatuses.reduce((acc,status)=>{
//                 const formattedKey = status.replace(/\s+/g,"");
//                 acc[formattedKey] = taskDistributionRaw.find((item)=>item._id=== status)?.count ||0
//                 return acc
//             },{})
//             taskDistribution["All"] = totalTasks;

//             //ensure all prorty levels are included

//             const taskPriorities = ["Low", "Medium", "High"]
//             const taskPriorityLevelsRaw = await Task.aggregate([
//                 {
//                     $group:{
//                         _id: "priority",
//                         count:{$sum:1}
//                     }
//                 }
//             ])

//             const taskPriorityLevels = taskPriorities.reduce((acc, priority)=>{
//                 acc[priority] =  taskPriorityLevelsRaw.find((item)=>item._id === priority)?.count || 0;
//                 return acc;
//             },{})

//             //fetch recent 10 sessions
//             const recentTasks = await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate createdAt")

//             res.status(200).json({
//                 statistics:{
//                     totalTasks,
//                     pendingTasks,
//                     completedTasks,
//                     overdueTasks,
//                 },
//                 charts:{
//                     taskDistribution,
//                     taskPriorityLevels,
//                 },
//                 recentTasks
//             })
//         }catch(error){
//         res.status(500).json({message:"Server error", error:error.message})
//     }
// }


// @desc Dashboard data (admin only)
// @route Get /api/tasks/user-dashboard-data
// @access Private

const getUserDashboardData = async (req,res) =>{
        try{
            const userId = req.user._id;

            //fetch statistics for user-specific tasks
            const totalTasks = await Task.countDocuments({assignedTo: req.user._id,});
            const pendingTasks = await Task.countDocuments({assignedTo: req.user._id, status:"Pending"});
            const completedTasks = await Task.countDocuments({assignedTo: req.user._id, status:"Completed"});
            const overdueTasks = await Task.countDocuments({
                assignedTo:userId,
                status:{$ne: "Completed"},
                dueDate:{$lt: new Date()}, 
            });

            const taskStatuses= ["Pending", "In Progress", "Completed"];
            const taskDistributionRaw = await Task.aggregate([
                {$match:{assignedTo:userId}},
                {$group:{
                    _id:"$status",
                    count:{$sum:1},
                }}
            
            ])
            const taskDistribution= taskStatuses.reduce((acc,status)=>{
                const formattedKey = status.replace(/\s+/g,"");
                acc[formattedKey] = taskDistributionRaw.find((item)=>item._id=== status)?.count ||0
                return acc
            },{})
            taskDistribution["All"] = totalTasks;

            const taskPriorities = ["Low", "Medium", "High"]
            const taskPriorityLevelsRaw = await Task.aggregate([
                {$match:{assignedTo:userId},},
                {
                    $group:{
                        _id: "priority",
                        count:{$sum:1}
                    }
                }
            ])

            const taskPriorityLevels = taskPriorities.reduce((acc, priority)=>{
                acc[priority] =  taskPriorityLevelsRaw.find((item)=>item._id === priority)?.count || 0;
                return acc;
            },{});

            //fetch recent 10 tasks ofr loggged in user

            const recentTasks = await Task.find({assignedTo:userId})
            .sort({createdAt:-1}).limit(10).select("title status priority dueDate createdAt")

            res.status(200).json({
                statistics:{
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overdueTasks,
                },
                charts:{
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks
            })

        }catch(error){
        res.status(500).json({message:"Server error", error:error.message})
    }
}

module.exports ={
    getTasks, getTaskById, createTask, updateTask, deleteTask, 
    updateTaskStatus, updateTaskChecklist, getUserDashboardData
}