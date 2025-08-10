import { createApp } from "./app";

const PORT = parseInt(process.env.PORT || "4000", 10);

const app = createApp();

app.listen(PORT, () => {
  console.log(`Ad Signal Hijack API listening on :${PORT}`);
});

