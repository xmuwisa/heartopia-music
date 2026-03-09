import darumadropTtfUrl from '$lib/assets/fonts/DarumadropOne-Regular.ttf?url';
import poppinsBoldTtfUrl from '$lib/assets/fonts/Poppins-Bold.ttf?url';
import poppinsRegularTtfUrl from '$lib/assets/fonts/Poppins-Regular.ttf?url';

type DownloadInstrumentPdfParams = {
	songTitle: string;
	keySetting: string;
	outputNotes: string;
};

type PdfFontPayload = {
	darumaBase64: string;
	poppinsBoldBase64: string;
	poppinsRegularBase64: string;
};

type PdfDocWithFonts = {
	addFileToVFS: (filename: string, data: string) => void;
	addFont: (postScriptName: string, id: string, fontStyle: string, fontWeight?: string) => void;
};

let cachedFontPayloadPromise: Promise<PdfFontPayload> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;
	let binary = '';

	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}

	return btoa(binary);
}

async function fetchFontBase64(fontUrl: string): Promise<string> {
	const response = await fetch(fontUrl);
	if (!response.ok) {
		throw new Error(`Failed to load font: ${fontUrl}`);
	}

	const buffer = await response.arrayBuffer();
	return arrayBufferToBase64(buffer);
}

async function getFontPayload(): Promise<PdfFontPayload> {
	if (!cachedFontPayloadPromise) {
		cachedFontPayloadPromise = (async () => {
			const [darumaBase64, poppinsBoldBase64, poppinsRegularBase64] = await Promise.all([
				fetchFontBase64(darumadropTtfUrl),
				fetchFontBase64(poppinsBoldTtfUrl),
				fetchFontBase64(poppinsRegularTtfUrl)
			]);

			return { darumaBase64, poppinsBoldBase64, poppinsRegularBase64 };
		})();
	}

	return cachedFontPayloadPromise;
}

async function registerPdfFonts(doc: PdfDocWithFonts): Promise<void> {
	const { darumaBase64, poppinsBoldBase64, poppinsRegularBase64 } = await getFontPayload();

	doc.addFileToVFS('DarumadropOne-Regular.ttf', darumaBase64);
	doc.addFont('DarumadropOne-Regular.ttf', 'DarumadropOne', 'normal');

	doc.addFileToVFS('Poppins-Bold.ttf', poppinsBoldBase64);
	doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');

	doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegularBase64);
	doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
}

function isLikelyKeybindLine(line: string): boolean {
	const trimmed = line.trim();
	if (!trimmed) return false;

	const tokens = trimmed.split(/\s+/);
	if (!tokens.length) return false;

	const isSingleKey = (value: string): boolean => /^[A-Z0-9,./\[\];'\\\-=]$/.test(value);
	const isNeutralSeparator = (value: string): boolean => /^[|(){}:]+$/.test(value);

	for (const token of tokens) {
		if (isNeutralSeparator(token)) {
			continue;
		}

		const cleanedToken = token.replace(/[|(){}:]/g, '');
		if (!cleanedToken) {
			continue;
		}

		const parts = cleanedToken.split('-');
		if (!parts.length) return false;

		for (const part of parts) {
			if (!part) {
				continue;
			}

			if (!isSingleKey(part)) return false;
		}
	}

	return true;
}

export async function downloadInstrumentPdf({
	songTitle,
	keySetting,
	outputNotes
}: DownloadInstrumentPdfParams): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	await registerPdfFonts(doc as unknown as PdfDocWithFonts);

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const centerX = pageWidth / 2;
	const margin = 15;
	const maxWidth = pageWidth - margin * 2;
	const lineHeight = 6;
	const titleLineHeight = 5;
	const titleStartY = 22;

	doc.setFont('DarumadropOne', 'normal');
	doc.setFontSize(22);
	const wrappedTitle = doc.splitTextToSize(songTitle.toUpperCase(), maxWidth) as string[];

	for (let i = 0; i < wrappedTitle.length; i += 1) {
		doc.text(wrappedTitle[i], centerX, titleStartY + i * titleLineHeight, { align: 'center' });
	}

	const subtitleY = titleStartY + wrappedTitle.length * titleLineHeight;

	doc.setFont('Poppins', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(130, 130, 130);
	doc.text(`HEARTOPIA ${keySetting.toUpperCase()} KEYBINDS`, centerX, subtitleY, {
		align: 'center'
	});

	doc.setTextColor(20, 20, 20);
	doc.setFont('Poppins', 'normal');
	doc.setFontSize(11);
	let y = subtitleY + 12;

	for (const rawLine of outputNotes.split('\n')) {
		doc.setFont('Poppins', isLikelyKeybindLine(rawLine) ? 'bold' : 'normal');
		const wrapped = doc.splitTextToSize(rawLine || ' ', maxWidth) as string[];

		for (const line of wrapped) {
			if (y > pageHeight - margin) {
				doc.addPage();
				y = 20;
			}

			doc.text(line, centerX, y, { align: 'center' });
			y += lineHeight;
		}
	}

	const safeTitle = songTitle
		.replace(/[^a-z0-9]+/gi, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();

	const safeKeySetting = keySetting
		.replace(/[^a-z0-9]+/gi, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();

	doc.save(`${safeTitle || 'heartopia-song'}-${safeKeySetting || 'key-setting'}-keybinds.pdf`);
}
