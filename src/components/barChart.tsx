import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';

interface BarDataItem {
    name: string;
    value: number;
}

interface Props {
    data: BarDataItem[];
    title?: string;
    options: echarts.EChartsOption;
}

const BarChart: React.FC<Props> = ({ data, title = "", options }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);
        const xData = data.map(item => item.name);
        const yData = data.map(item => item.value);

        const option: echarts.EChartsOption = {
            ...options,
            title: { ...options?.title, text: title },
            xAxis: { ...options?.xAxis, data: xData },
            series: [
                {
                    ...(options?.series as any)[0],
                    data: yData
                }
            ]
        };

        chart.setOption(option);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [data, title]);

    return (
        <Card className='rounded-lg'>
            <div ref={chartRef} style={{ width: '100%', height: 130 }} />
        </Card>
    );
};

export default BarChart;
