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
  addTicketToProject,
  getCountByUrgency,
} = require("../controllers/Projects");

router.get("/count-urgency", getCountByUrgency);

router.get("/", checkAuth, getProjectsByUserId);
router.post("/", checkAuth, createProject);
router.get("/:projectId", checkAuth, getProjectById);
router.put("/:projectId", checkAuth, updateProject);
router.delete("/:projectId", checkAuth, deleteProject);
router.delete("/", checkAuth, removeTicketFromProject);
router.post("/add", checkAuth, addTicketToProject);

module.exports = router;
