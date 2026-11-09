/**
 * Minimal ZIP writer, store only (no compression), dependency-free.
 *
 * The export bundles a handful of small text files (CSS, JSON, README). A stored ZIP is a
 * well-specified, compact format for that, so there is no need for a third-party library
 * (the review already flagged untracked vendored code). It writes a local file header per
 * entry, then the central directory and the end-of-central-directory record, per the ZIP
 * APPNOTE. UTF-8 file names are flagged via bit 11 of the general-purpose flags.
 */

type ZipEntry = { name: string; data: Uint8Array; crc: number; offset: number };

const textEncoder = new TextEncoder();

/** CRC-32 (IEEE 802.3), computed with a lazily built lookup table. */
const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n += 1) {
		let c = n;
		for (let k = 0; k < 8; k += 1) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[n] = c >>> 0;
	}
	return table;
})();

const crc32 = (bytes: Uint8Array): number => {
	let crc = 0xffffffff;
	for (let i = 0; i < bytes.length; i += 1) {
		crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
};

/** Writes a DOS date/time; a fixed timestamp keeps the output deterministic. */
const DOS_TIME = 0;
const DOS_DATE = 0x21; // 1980-01-01

/**
 * Builds a ZIP (store only) from `{ name: content }`. Returns a Blob ready for download.
 */
export const createZip = (files: Record<string, string>): Blob => {
	const chunks: Uint8Array[] = [];
	const entries: ZipEntry[] = [];
	let offset = 0;

	const push = (bytes: Uint8Array) => {
		chunks.push(bytes);
		offset += bytes.length;
	};

	for (const [name, content] of Object.entries(files)) {
		const nameBytes = textEncoder.encode(name);
		const data = textEncoder.encode(content);
		const crc = crc32(data);
		const local = new DataView(new ArrayBuffer(30));
		local.setUint32(0, 0x04034b50, true); // local file header signature
		local.setUint16(4, 20, true); // version needed
		local.setUint16(6, 0x0800, true); // flags: UTF-8 names
		local.setUint16(8, 0, true); // method: store
		local.setUint16(10, DOS_TIME, true);
		local.setUint16(12, DOS_DATE, true);
		local.setUint32(14, crc, true);
		local.setUint32(18, data.length, true); // compressed size
		local.setUint32(22, data.length, true); // uncompressed size
		local.setUint16(26, nameBytes.length, true);
		local.setUint16(28, 0, true); // extra length
		entries.push({ name, data, crc, offset });
		push(new Uint8Array(local.buffer));
		push(nameBytes);
		push(data);
	}

	const centralStart = offset;
	for (const entry of entries) {
		const nameBytes = textEncoder.encode(entry.name);
		const central = new DataView(new ArrayBuffer(46));
		central.setUint32(0, 0x02014b50, true); // central directory header signature
		central.setUint16(4, 20, true); // version made by
		central.setUint16(6, 20, true); // version needed
		central.setUint16(8, 0x0800, true); // flags: UTF-8 names
		central.setUint16(10, 0, true); // method: store
		central.setUint16(12, DOS_TIME, true);
		central.setUint16(14, DOS_DATE, true);
		central.setUint32(16, entry.crc, true);
		central.setUint32(20, entry.data.length, true);
		central.setUint32(24, entry.data.length, true);
		central.setUint16(28, nameBytes.length, true);
		central.setUint16(30, 0, true); // extra length
		central.setUint16(32, 0, true); // comment length
		central.setUint16(34, 0, true); // disk number
		central.setUint16(36, 0, true); // internal attributes
		central.setUint32(38, 0, true); // external attributes
		central.setUint32(42, entry.offset, true); // local header offset
		push(new Uint8Array(central.buffer));
		push(nameBytes);
	}
	const centralSize = offset - centralStart;

	const end = new DataView(new ArrayBuffer(22));
	end.setUint32(0, 0x06054b50, true); // end of central directory signature
	end.setUint16(8, entries.length, true); // entries on this disk
	end.setUint16(10, entries.length, true); // total entries
	end.setUint32(12, centralSize, true);
	end.setUint32(16, centralStart, true);
	push(new Uint8Array(end.buffer));

	return new Blob(chunks as BlobPart[], { type: 'application/zip' });
};
