import { AllStatusKeys } from "@/entities/deal/lib/constants";

export type Deal = {
  dateRequest: Date;
  resource: string;
  dealStatus: AllStatusKeys;
};

export type Props = {
  data: {
    deals: Deal[] | [];
    totalDealsCount: number;
  };
};

type PieLabelRenderProps = {
  cx: number;
  cy: number;
  midAngle?: number;
  innerRadius: number;
  outerRadius: number;
  percent?: number;
  index?: number;
  payload?: {
    name: string;
    value: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type CustomizedLabelProps = PieLabelRenderProps & {
  width?: number;
  isDark?: boolean;
};
