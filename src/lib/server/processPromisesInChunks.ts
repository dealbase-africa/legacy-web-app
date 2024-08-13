function* chunkArrayGenerator(array: Promise<unknown>[], chunkSize: number) {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

export async function processPromisesInChunks(
  promises: Promise<unknown>[],
  chunkSize: number,
) {
  const generator = chunkArrayGenerator(promises, chunkSize);
  let results: unknown[] = [];

  for (const chunk of generator) {
    // Wait for all promises in the current chunk to resolve
    const chunkResults = await Promise.all(chunk);
    results = results.concat(chunkResults);
  }

  return results;
}
