import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';
import { barBaseOption } from '../const';

interface BarDataItem {
    name: string;
    value: number;
}

interface Props {
    data: BarDataItem[];
    title?: string;
}

const BarChart: React.FC<Props> = ({ data, title = "" }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);
        const xData = data.map(item => item.name);
        const yData = data.map(item => item.value);

        console.log({ yData })

        const option: echarts.EChartsOption = {
            ...barBaseOption,
            title: { ...barBaseOption.title, text: title },
            xAxis: { ...barBaseOption.xAxis, data: xData },
            series: [
                {
                    ...(barBaseOption.series as any)[0],
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
