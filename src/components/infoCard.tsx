import { Card, Tooltip } from 'antd';
import React from 'react';
import styles from './styles/styles.module.css';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';
interface SvgWithContentProps {
    title?: string;
    children?: React.ReactNode;
    backgroundImg: string,
    cardStyles?: React.CSSProperties,
    count: number
    tooltipText?: string
    onCardClick?: () => void
}

const InfoCard: React.FC<SvgWithContentProps> = ({
    backgroundImg,
    title = '',
    count,
    cardStyles,
    tooltipText,
    onCardClick
}) => {

    return (
        <Card
            className={styles.card}
            style={{
                ...cardStyles,
                backgroundImage: `url(${backgroundImg})`,
            }}
            onClick={onCardClick}
        >
            {title}
            {
                tooltipText &&
                <Tooltip placement="top" title={tooltipText}>
                    <QuestionCircleOutlined className='ml-2 cursor-pointer' />
                </Tooltip>
            }
            <div className={styles.countNum}>
                {count}
            </div>
        </Card>
    );
};

export default InfoCard;