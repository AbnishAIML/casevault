// Client-side Cryptographic Utilities using W3C Web Cryptography API
// Provides genuine SHA-256 hashing, tamper verification, and hash-chain audit ledger validation

export async function computeSha256(input) {
  let buffer;
  if (typeof input === "string") {
    const encoder = new TextEncoder();
    buffer = encoder.encode(input);
  } else if (input instanceof ArrayBuffer) {
    buffer = input;
  } else if (input instanceof Uint8Array) {
    buffer = input.buffer;
  } else {
    const encoder = new TextEncoder();
    buffer = encoder.encode(JSON.stringify(input));
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hexHash;
}

export async function verifyDocumentIntegrity(storedHash, fileContentOrBuffer) {
  const startTime = performance.now();
  const computedHash = await computeSha256(fileContentOrBuffer);
  const durationMs = (performance.now() - startTime).toFixed(2);

  const isVerified = (storedHash.toLowerCase() === computedHash.toLowerCase());

  return {
    verified: isVerified,
    storedHash: storedHash.toLowerCase(),
    computedHash: computedHash.toLowerCase(),
    durationMs,
    timestamp: new Date().toISOString(),
    bitMatchRate: isVerified ? "100.00% (Bit-Exact)" : "0.00% (Mismatch Detected)"
  };
}

export async function calculateBlockCurrentHash(previousHash, eventType, entityId, timestamp, metadata) {
  const canonicalData = typeof metadata === "string" ? metadata : JSON.stringify(metadata);
  const payload = `${previousHash}|${eventType}|${entityId}|${timestamp}|${canonicalData}`;
  return await computeSha256(payload);
}

export async function verifyFullIntegrityLedger(blocks) {
  const startTime = performance.now();
  const results = [];
  let brokenBlockIndex = -1;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    let isPrevHashValid = true;

    // Check link to previous block
    if (i > 0) {
      const prevBlock = blocks[i - 1];
      if (block.previousHash.toLowerCase() !== prevBlock.currentHash.toLowerCase()) {
        isPrevHashValid = false;
      }
    }

    const calculatedHash = await calculateBlockCurrentHash(
      block.previousHash,
      block.eventType,
      block.entityId,
      block.timestamp,
      block.metadata
    );

    const isHashValid = isPrevHashValid && (block.currentHash.toLowerCase() === calculatedHash.toLowerCase());

    results.push({
      blockNumber: block.blockNumber,
      eventId: block.eventId,
      isValid: isHashValid,
      isPrevLinkValid: isPrevHashValid,
      expectedHash: calculatedHash,
      actualHash: block.currentHash
    });

    if (!isHashValid && brokenBlockIndex === -1) {
      brokenBlockIndex = i;
    }
  }

  const durationMs = (performance.now() - startTime).toFixed(2);
  const isChainValid = brokenBlockIndex === -1;

  return {
    isValid: isChainValid,
    totalBlocksChecked: blocks.length,
    brokenBlockIndex,
    brokenBlockId: brokenBlockIndex !== -1 ? blocks[brokenBlockIndex].eventId : null,
    durationMs,
    blockResults: results
  };
}
