const express= require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {  getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");
const {llmTaskBreaker}  = require('../controllers/LLMController')
const router =  express.Router();


// router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.put("/:id/status", protect,updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);
router.post("/ai-chat", protect, llmTaskBreaker)

module.exports = router;
