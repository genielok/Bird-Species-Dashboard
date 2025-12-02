import * as echarts from "echarts";
import React, { useEffect, useRef } from 'react';

const option = {
    series: [
        {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '75%'],
            radius: '90%',
            min: 0,
            max: 1,
            splitNumber: 3,
            axisLine: {
                lineStyle: {
                    width: 6,
                    color: [
                        [0.25, '#FF6E76'],  // Grade D
                        [0.5, '#FDDD60'],   // Grade C
                        [0.75, '#58D9F9'],  // Grade B
                        [1, '#7CFFB2']      // Grade A
                    ]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto',
                    width: 5
                }
            },
            axisLabel: {
                show: false
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 20
            },
            detail: {
                fontSize: 30,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: function (value: number) {
                    return value + '';
                },
                color: 'inherit'
            },
        }
    ]
};

const GaugeChart: React.FC<{ gaugeValue: number }> = ({ gaugeValue }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        const gaugeOption = {
            ...option,
            series: [
                {
                    ...option.series[0],
                    data: [
                        {
                            value: (gaugeValue / 100).toFixed(2),
                            name: 'NPI'
                        }
                    ]
                }
            ]
        };

        chart.setOption(gaugeOption);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [gaugeValue]);

    return (
        <div ref={chartRef} style={{ width: '100%', height: 180 }} />
    );
}

export default GaugeChart;