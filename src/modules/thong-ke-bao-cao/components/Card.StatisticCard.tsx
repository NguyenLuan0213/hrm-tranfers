import React from "react";
import { Card, Statistic } from "antd";

interface StatisticCardProps {
    title: string;
    value: string | number;
    valueStyle?: React.CSSProperties;
    suffix?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, valueStyle, suffix }) => {
    return (
        <Card>
            <Statistic
                title={title}
                value={value}
                valueStyle={valueStyle}
                suffix={suffix}
            />
        </Card>
    );
};

export default StatisticCard;