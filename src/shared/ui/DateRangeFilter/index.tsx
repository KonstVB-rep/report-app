// import React, { useState, useEffect } from "react";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
// import { DateRange } from "react-day-picker";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";

// interface DateRangeFilterProps {
//   onDateChange: (date: DateRange | undefined) => void;
//   onClearDateFilter: (columnId: string) => void;
//   value?: DateRange;
// }

// const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
//   onDateChange,
//   onClearDateFilter,
//   value,
// }) => {
//   const [date, setDate] = useState<DateRange | undefined>(undefined);

//   useEffect(() => {
//     setDate(value);
//   }, [value]);

//   // const handleDateChange = (date: DateRange | undefined) => {
//   //   setDate(date);
//   //   onDateChange(date);
//   // };

//   const handleDateChange = (date: DateRange | undefined) => {
//     console.log("DateRangePicker выбрал:", date);

//     // Проверим, если вдруг передаются строки вместо Date
//     if (date?.from && typeof date.from === "string") {
//       date.from = new Date(date.from);
//     }
//     if (date?.to && typeof date.to === "string") {
//       date.to = new Date(date.to);
//     }

//     setDate(date);
//     onDateChange(date);
//   };

//   const handleClear = () => {
//     onDateChange(undefined);
//     setDate(undefined);
//     onClearDateFilter("dateRequest");
//   };

//   return (
//     <div className={`flex items-center gap-4 relative max-w-fit border rounded ${
//       date ? "border-solid" : "border-dashed"
//     } border-muted-foreground`}>
//       <DateRangePicker value={date} onValueChange={handleDateChange} />
//       {date && (
//         <Button
//           variant={"outline"}
//           onClick={handleClear}
//           className="absolute right-0 p-2 h-full"
//         >
//           <X />
//         </Button>
//       )}
//     </div>
//   );
// };

// export default DateRangeFilter;

// import React from "react";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
// import { DateRange } from "react-day-picker";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";

// interface DateRangeFilterProps {
//   onDateChange: (date: DateRange | undefined) => void;
//   onClearDateFilter: (columnId: string) => void;
//   value?: DateRange;
// }

// const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
//   onDateChange,
//   onClearDateFilter,
//   value,
// }) => {
//   // Используем сразу переданное `value`, без `useState`
//   // const handleDateChange = (date: DateRange | undefined) => {
//   //   console.log("DateRangePicker выбрал:", date);

//   //   if (date?.from && typeof date.from === "string") {
//   //     date.from = new Date(date.from);
//   //   }
//   //   if (date?.to && typeof date.to === "string") {
//   //     date.to = new Date(date.to);
//   //   }

//   //   onDateChange(date);
//   // };
//   const handleDateChange = (date: DateRange | undefined) => {
//     console.log("DateRangePicker выбрал:", date);

//     // Проверим, если вдруг передаются строки вместо Date
//     if (date?.from && typeof date.from === "string") {
//       date.from = new Date(date.from);
//     }
//     if (date?.to && typeof date.to === "string") {
//       date.to = new Date(date.to);
//     }

//     onDateChange(date);
//   };

//   const handleClear = () => {
//     onDateChange(undefined);
//     onClearDateFilter("dateRequest");
//   };

//   return (
//     <div className={`flex items-center gap-4 relative max-w-fit border rounded ${
//       value ? "border-solid" : "border-dashed"
//     } border-muted-foreground`}>
//       <DateRangePicker value={value} onValueChange={handleDateChange} />
//       {value && (
//         <Button
//           variant={"outline"}
//           onClick={handleClear}
//           className="absolute right-0 p-2 h-full"
//         >
//           <X />
//         </Button>
//       )}
//     </div>
//   );
// };

// export default DateRangeFilter;

import React from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DateRangeFilterProps {
  onDateChange: (date: DateRange | undefined) => void;
  onClearDateFilter: (columnId: string) => void;
  value?: DateRange;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateChange,
  onClearDateFilter,
  value,
}) => {
  // Используем сразу переданное `value`, без `useState`
  const handleDateChange = (date: DateRange | undefined) => {
    if (date?.from && typeof date.from === "string") {
      date.from = new Date(date.from);
    }
    if (date?.to && typeof date.to === "string") {
      date.to = new Date(date.to);
    }

    onDateChange(date);
  };

  const handleClear = () => {
    onDateChange(undefined);
    onClearDateFilter("dateRequest");
  };

  return (
    <div
      className={`relative flex max-w-fit items-center gap-4 rounded border ${
        value ? "border-solid" : "border-dashed"
      } border-muted-foreground`}
    >
      <DateRangePicker value={value} onValueChange={handleDateChange} />
      {value && (
        <Button
          variant={"outline"}
          onClick={handleClear}
          className="absolute right-0 h-full p-2"
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
