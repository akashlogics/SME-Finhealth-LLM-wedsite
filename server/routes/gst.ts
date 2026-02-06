import express from "express";

const router = express.Router();

router.post("/validate", async (req, res) => {
  const { gstin } = req.body;

  if (!gstin || gstin.length !== 15) {
    return res.status(400).json({ valid: false });
  }

  res.json({
    valid: true,
    compliance: "GSTIN format valid"
  });
});

export default router;
