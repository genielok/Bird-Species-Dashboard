import { get, post } from "./api";

export function downloadCsv(data: Record<string, any>[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = data.map(row =>
        headers.map(header => JSON.stringify(row[header] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...csvRows].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
}

export interface Detection {
    id: string;
    scientific_name: string;
    common_name: string;
    confidence: number;
    filename: string;
    // ... 可能还有其他字段
}

interface ApiResponse<T> {
    code: number;
    message: string;
    total: number;
    data: T;
}


export async function analyzeAudioFiles(data: FormData) {
    return post<ApiResponse<Detection[]>>('/analyze', data);
}

export async function getAnalyzeList() {
    return get<ApiResponse<Detection[]>>('/detections');
}