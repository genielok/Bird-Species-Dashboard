import type { UploadFile } from "antd";
import { get, post } from "./api";
import type { AnalyzeDataType } from "../pages/uploadAudioPage/const";
export interface Detection {
    id: string;
    scientific_name: string;
    common_name: string;
    confidence: number;
    filename: string;
    protection_level?: string
    iucn_url?: string
    detection_count?: string
}

interface ApiResponse<T> {
    code: number;
    message: string;
    total: number;
    data: T;
}

export type TSearchParams = {
    projectName?: string,
    startTime?: string,
    endTime?: string
}

type GetS3URLRes = {
    urls: {
        s3_key: string,
        upload_url: string
    }[]
}


export async function getAnalyzeList(params?: TSearchParams) {
    return get<ApiResponse<AnalyzeDataType[]>>('/detections', params);
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));

}

export async function getPresignedUrl(
    projectName: string,
    files: any[]
) {
    return await post('/generate-multi-presigned', {
        projectName,
        files
    })
}

export async function uploadFileToS3(data: GetS3URLRes, fileList: UploadFile<any>[]) {
    const response = await Promise.all(
        data.urls.map(({ upload_url }, idx) =>
            fetch(upload_url, {
                method: 'PUT',
                body: fileList[idx].originFileObj,
                headers: { 'Content-Type': fileList[idx]?.type || "audio/wav" },
            })
        )
    );
    return response;
}

export async function startAnalysis(s3_keys: string[], projectName: string) {
    return await post('/start-analysis-batch', {
        projectName: projectName,
        s3_keys,
    })

}


/**
 * IUCN 红色名录信息
 */
export interface IucnInfo {
    category: string;
    url?: string;
}


export interface TaxonomyInfo {
    CATEGORY: string;
    SPECIES_CODE: string;
    TAXON_ORDER: string;
}



export type InfoDetail = {
    enriched_data: EnrichedData,
    session: Session
}

export interface Species {
    scientific_name: string;
    common_name: string;
    detection_count: number;
    avg_confidence: number;
    first_detected_at?: number;
    last_detected_at?: number;
    iucn: IucnInfo;
    taxonomy: TaxonomyInfo;
}


export type EnrichedData = {
    birdnet: Species[];
    perch: Species[];
    comparison: {
        detected_by_at_least_one: Species[];
        detected_by_at_least_two: Species[];
    }
}
export interface Session {
    audio_files: AudioFile[];
    create_time: number;
    detections: Detection[];
    file_count: number;
    model: string;
    npi: Npi;
    projectName: string;
    result_prefix: string;
    session_id: string;
    // species: Species[];
    status: string;
    timestamp: number;
    total_detections: number;
}

export interface AudioFile {
    s3_key: string;
    bucket: string;
    filename: string;
}

export interface Npi {
    shannon_diversity: number;
    evenness: number;
    score: number;
    threat_composition: ThreatComposition;
    updated_at: number;
    species_richness: number;
    dominance: number;
    total_detections: number;
}

export interface ThreatComposition {
    endangered: number;
    least_concern: number;
    vulnerable: number;
    near_threat: number;
}


export async function getAnalyzeDetail(id: string) {
    return await get<ApiResponse<InfoDetail>>('/detections-detail', {
        session_id: id,
    })
}

export async function getNPIReport(sessionId: string) {
    const response = await get<any>('/download-npi', { session_id: sessionId, responseType: 'blob' });
    return response;
}
export async function getAudioResults(sessionId: string) {
    const response = await get<any>('/download', { session_id: sessionId, responseType: 'blob' });
    return response;
}

export async function downloadBlobFile(requestFn: () => Promise<Blob>, filename: string) {
    const blob = await requestFn();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

