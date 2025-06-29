import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Pie, PolarChart } from "victory-native";

interface Section {
  percentage: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  sections: Section[];
  radius: number;
  strokeWidth: number;
  textColor: string;
  className?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  sections,
  radius,
  strokeWidth,
  textColor,
  className,
}) => {
  const normalizedSections = useMemo(() => {
    const total = sections.reduce(
      (sum, section) => sum + Math.max(0, section.percentage),
      0
    );
    if (total === 0)
      return sections.map((section) => ({ ...section, percentage: 0 }));
    return sections.map((section) => ({
      ...section,
      percentage: (Math.max(0, section.percentage) / total) * 100,
    }));
  }, [sections]);

  // Transform sections data for Victory Native XL
  const victoryData = useMemo(() => {
    return normalizedSections.map((section, index) => ({
      label: section.label,
      value: section.percentage,
      color: section.color,
    }));
  }, [normalizedSections]);

  const renderLegend = () => {
    return normalizedSections.map((section, index) => (
      <View key={index} className="flex flex-row items-center mb-1">
        <View
          className="w-5 h-5 mr-2"
          style={{ backgroundColor: section.color }}
        />
        <Text className="text-base" style={{ color: textColor }}>
          {section.label} - {section.percentage.toFixed(1)}%
        </Text>
      </View>
    ));
  };

  const isEmpty = normalizedSections.every(
    (section) => section.percentage === 0
  );

  if (isEmpty) {
    return (
      <View className="flex items-center justify-center h-52">
        <Text className="text-base" style={{ color: textColor }}>
          No data to display
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex items-center p-5 ${className}`}>
      <View className="mb-5" style={{ height: radius * 2, width: radius * 2 }}>
        <PolarChart
          data={victoryData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius={`${((radius - strokeWidth) / radius) * 100}%`} />
        </PolarChart>
      </View>
      <View className="flex items-start">{renderLegend()}</View>
    </View>
  );
};

export default DonutChart;
