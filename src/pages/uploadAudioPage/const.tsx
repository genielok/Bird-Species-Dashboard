import type { TableProps } from "antd";
import { Tag } from "antd";
import { type Detection } from "../../utils/analyze";


export interface AnalyzeDataType {
    detections: Detection[];
    audio_files: {
        filename: string,
        s3_key: string
    }[];
    session_id: string;
    timestamp: string;
    projectName: string;
    status: string
}


const ColorStatus = {
    COMPLETED: 'success',
    PROCESSING: 'processing',
    FAILED: 'error',
} as const;

type Status = keyof typeof ColorStatus;
export const columns: TableProps<AnalyzeDataType>['columns'] = [
    {
        title: '#',
        key: 'index',
        render: (_, _1, index) => index + 1
    },
    {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
    },
    {
        title: 'Audio Number',
        dataIndex: 'file_count',
        key: 'file_count',
        align: 'center',
    },
    {
        title: 'BirdNET Detections',
        dataIndex: 'total_detections',
        key: 'total_detections',
        align: 'center',
    },
    {
        title: 'Create Time',
        width: 180,
        dataIndex: 'create_time',
        key: 'create_time',
        render: (ts: string) => ts ? new Date(ts).toLocaleString() : '-',

    },
    {
        title: 'Update Time',
        dataIndex: 'timestamp',
        width: 190,
        key: 'end_time',
        render: (ts: string) => new Date(ts).toLocaleString(),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 100,
        key: 'status',
        render: (status: Status) => <Tag color={ColorStatus[status]}>{status}</Tag>
    },

];