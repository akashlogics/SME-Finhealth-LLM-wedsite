import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  // Placeholder: parse CSV/XLSX/PDF later
  res.json({
    message: "File received successfully",
    status: "ok"
  });
});

export default router;
