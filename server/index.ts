import express from "express";
import cors from "cors";
import financialAIRoutes from "./routes/financial-ai";
import uploadRoutes from "./routes/upload";
import gstRoutes from "./routes/gst";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", financialAIRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/gst", gstRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
