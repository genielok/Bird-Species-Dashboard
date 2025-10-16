import type { TableProps } from "antd";
import { Button, Space, Tag } from "antd";
import { downloadCsv, type Detection } from "../../utils/analyze";


export interface AnalyzeDataType {
    detections: Detection[];
    processed_files: string[];
    session_id: number;
    timestamp: string;
}

export const columns: TableProps<AnalyzeDataType>['columns'] = [
    {
        title: '#',
        key: 'index',
        render: (_, _1, index) => index + 1
    },
    {
        title: 'Project ID',
        dataIndex: 'session_id',
        key: 'id',
    },
    {
        title: 'Audio File',
        dataIndex: 'processed_files',
        key: 'processed_files',
        render: (files: string[]) => (
            <Space direction="vertical" size="small">
                {files.map(file => <Tag key={file}>{file}</Tag>)}
            </Space>
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total_detections',
        key: 'total_detections',
        align: 'center',
    },
    {
        title: 'Date',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (ts: string) => new Date(ts).toLocaleString(),

    },
    {
        title: 'Action',
        render: (_, record) => {
            const Download = () => {
                downloadCsv(record.detections, `file_${record.session_id}`)
            };
            return <Button onClick={Download}> Download </Button>;
        },
    },
];