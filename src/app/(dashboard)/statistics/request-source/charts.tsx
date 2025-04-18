"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Deal = {
  dateRequest: Date; // ISO string
  resource: string;
};

type Props = {
  deals:  Deal[];
};

const normalizeResource = (resource: string): string =>
    resource.replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .toLowerCase();

export const RequestsPerSiteChart = ({ deals }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>("");

  if(deals.length === 0){
    return null
  }

  // Группируем по дате и ресурсу
  const data = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    const filteredDeals = deals.filter(({ dateRequest, resource }) => {
      const date = dateRequest.toISOString().split("T")[0]; // только yyyy-mm-dd

      const dateMatches = selectedDate ? new Date(date) >= selectedDate : true;
      const siteMatches = selectedSite ? resource?.includes(selectedSite) : true;

      return dateMatches && siteMatches;
    });

    filteredDeals.forEach(({ dateRequest, resource }) => {
      const date = new Date(dateRequest).toISOString().split("T")[0]; // только yyyy-mm-dd

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][resource]) grouped[date][resource] = 0;

      grouped[date][resource]++;
    });

    const allResources = Array.from(new Set(filteredDeals.map((d) => d.resource)));

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, resMap]) => {
        const row: Record<string, any> = { date };
        allResources.forEach((res) => {
          row[res] = resMap[res] ?? 0;
        });
        return row;
      });
  }, [deals, selectedDate, selectedSite]);

  const allResources = useMemo(
    () => Array.from(new Set(deals.map((d) => d.resource))),
    [deals]
  );



  return (
    <div>
      <div>
        <label>Выберите дату:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div>
        <label>Выберите сайт:</label>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
        >
          <option value="">Все сайты</option>
          {allResources.map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {allResources.map((res) => (
            <Line
              key={res}
              type="monotone"
              dataKey={res}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              dot={false} // Для отображения линии без точек
              activeDot={{ r: 8 }} // Активные точки при наведении
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
