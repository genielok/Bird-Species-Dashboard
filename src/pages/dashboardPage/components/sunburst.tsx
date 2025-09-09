// import React, { useEffect, useRef } from 'react'
// import * as echarts from "echarts";
// import { Option, } from '../const';
// import styles from '../styles.module.css';
// import Papa from "papaparse";


// export interface SunburstNode {
//     name: string;
//     value: number;
//     itemStyle?: {
//         color: string;
//     };
//     children?: SunburstNode[];
// }


// const Sunburst: React.FC = () => {
//     const chartRef = useRef(null)


// async function loadCSV(filePath: string) {
//     const response = await fetch(filePath);  // 前端通过 fetch 读取
//     const csvText = await response.text();

//     const { data } = Papa.parse(csvText, {
//         header: true,    // 把第一行作为 key
//         skipEmptyLines: true
//     });

//     return data; // 直接得到 JSON 数组
// }

// const buildSunburstData = async (): Promise<SunburstNode[]> => {
//     const captureData = await loadCSV('/CaptureCountData.csv')
//     return StatusData.map(status => {
//         const filtered = L1Data.filter(sp => sp["Threat Status"] === status.IUCNStatusAcrynom);


//         const children: SunburstNode[] = filtered.map(sp => {
//             const capture = captureData.find(c => c.species === sp.species);
//             return {
//                 name: sp["species"],
//                 value: capture ? capture.Max : 0,
//                 itemStyle: {
//                     color: statusColors[status.IUCNStatusAcrynom]
//                 }
//             };
//         });

//         const totalCapture = children.reduce((sum, c) => sum + (c.value || 0), 0);

//         return {
//             name: status.IUCNStatus,
//             value: totalCapture,
//             itemStyle: {
//                 color: statusColors[status.IUCNStatusAcrynom]
//             },
//             children
//         };
//     });
// };


//     useEffect(() => {
//         const chart = echarts.init(chartRef.current)
//         // const data = buildSunburstData()

//         const curOption = {
//             ...Option,
//             series: {
//                 ...Option.series,
//                 nodeClick: 'rootToNode', // 点击状态后进入子层级
//                 data: []
//             }
//         }
//         chart.setOption(curOption)


//         const handleResize = () => chart.resize();
//         window.addEventListener('resize', handleResize);



//         return () => {
//             window.removeEventListener('resize', handleResize);
//             chart.dispose(); // 组件卸载时释放
//         };

//     }, [])


//     return <div className={styles.sunburstCard} ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
// }

// export default Sunburst