import React, { useEffect, useRef, useState } from 'react'
import * as echarts from "echarts";
import styles from '../styles.module.css';
import { Modal } from 'antd';
import { basePieOption, colorMap, TIUCNStatus } from '../const';


type EChartsOption = echarts.EChartsOption;

interface PieSpeceisPros {
    title: string,
    data: {
        "species": string;
        "Common Name": string;
        "Threat Status": string;
    }[]
}

const PieChart: React.FC<PieSpeceisPros> = ({ data, title }) => {
    const chartRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [speceisList, setSpeceisList] = useState<String[]>([])


    const initPiechart = () => {
        const chart = echarts.init(chartRef.current)

        const grouped = data.reduce((acc, item) => {
            const status = item["Threat Status"];
            if (!acc[status]) {
                acc[status] = {
                    value: 0,
                    name: TIUCNStatus[status],
                    speceis: [] as string[],
                    itemStyle: { color: colorMap[status] } // ✅ 在这里固定颜色

                };
            }
            acc[status].value += 1;
            acc[status].speceis.push(item["species"]);
            return acc;
        }, {} as Record<string, { value: number; name: string; speceis: string[]; itemStyle: { color: string } }>);


        const pieData = Object.values(grouped);
        const curOption: EChartsOption = {
            ...basePieOption,
            title: {
                ...basePieOption.title,
                text: title,
            },
            series: [
                {
                    ...(basePieOption.series as any)[0],
                    data: pieData
                }
            ]
        };

        chart.setOption(curOption)

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        chart.on("click", (params) => {
            const data = params.data as { speceis: string[] } | undefined;
            console.log({ data })
            data?.speceis && showModal(data?.speceis)
        });


    }
    useEffect(() => {
        initPiechart()
    }, [data])

    const showModal = (speceisList: string[]) => {
        setSpeceisList(speceisList)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return <>
        <div className={styles.sunburstCard} ref={chartRef} style={{ width: '100%', height: '420px' }}></div>
        <Modal
            title="Speceis List"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            {speceisList.map(item => <div>{item}</div>)}
        </Modal>
    </>
}

export default PieChart