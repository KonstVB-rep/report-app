export type Deal = {
    dateRequest: Date;
    resource: string;
  };
  
export type Props = {
data: {
    deals: Deal[] | [];
    totalDealsCount: number;
};
};

export type CustomizedLabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
    index: number;
    payload: { name: string };
  };