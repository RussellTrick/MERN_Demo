const { Router } = require("express");
const router = Router();
const { checkAuth } = require("../middlewares/auth");
const {
  getProjectsByUserId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  removeTicketFromProject,
} = require("../controllers/Projects");

router.get("/", checkAuth, getProjectsByUserId);
router.post("/", checkAuth, createProject);

router.get("/:projectId", checkAuth, getProjectById);
router.put("/:projectId", checkAuth, updateProject);
router.delete("/:projectId", checkAuth, deleteProject);
router.delete("/", checkAuth, removeTicketFromProject);

module.exports = router;
