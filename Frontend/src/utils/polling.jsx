export async function poll(fetcher, options = {}) {
  const {
    intervalMs = 800,
    timeoutMs = 30000,
    shouldStop,
    onTick,
  } = options;

  const start = Date.now();

  while (true) {
    const data = await fetcher();
    if (onTick) onTick(data);

    if (shouldStop && shouldStop(data)) return data;

    if (Date.now() - start > timeoutMs) {
      throw new Error("Polling timeout");
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
