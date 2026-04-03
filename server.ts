import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DATA_FILE = path.join(process.cwd(), "analyses.json");

  // Endpoint para salvar análises
  app.post("/api/analyses", async (req, res) => {
    const newAnalysis = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    // Salva localmente no JSON
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
    data.push(newAnalysis);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // ENVIO PARA O EXCEL (Power Automate)
    const webhookUrl = process.env.EXCEL_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Data: new Date(newAnalysis.timestamp).toLocaleDateString(),
            Hora: new Date(newAnalysis.timestamp).toLocaleTimeString(),
            Conformista: newAnalysis.conformista || "N/A",
            Processo: newAnalysis.processo || "N/A",
            Numero_Documento: newAnalysis.numeroDoc || "N/A",
            Tipo_Documento: newAnalysis.tipoDoc || "N/A",
            Resultado: newAnalysis.resultado || "N/A",
            Ocorrencias: (newAnalysis.restricoes || []).join(", "),
            Observacao: newAnalysis.observacao || ""
          })
        });
        console.log("Dados enviados para o Excel com sucesso!");
      } catch (err) {
        console.error("Erro ao enviar para o Excel:", err);
      }
    }

    res.json({ success: true, analysis: newAnalysis });
  });

  // Endpoint para listar análises
  app.get("/api/analyses", (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      res.json(data);
    } else {
      res.json([]);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
