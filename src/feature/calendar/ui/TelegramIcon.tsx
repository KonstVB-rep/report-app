import * as React from "react";

const TelegramIcon = ({fill,width, height,...props}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlSpace="preserve"
    id="Layer_1"
    x="0"
    y="0"
    version="1.1"
    viewBox="0 0 300 300"
    width={width}
    height={height}
    {...props}
  >
    <g id="XMLID_496_">
      <path
        id="XMLID_497_"
        fill={fill}
        d="m5.299 144.645 69.126 25.8 26.756 86.047c1.712 5.511 8.451 7.548 12.924 3.891l38.532-31.412a11.496 11.496 0 0 1 14.013-.391l69.498 50.457c4.785 3.478 11.564.856 12.764-4.926L299.823 29.22c1.31-6.316-4.896-11.585-10.91-9.259L5.218 129.402c-7.001 2.7-6.94 12.612.081 15.243m91.57 12.066 135.098-83.207c2.428-1.491 4.926 1.792 2.841 3.726L123.313 180.87a23.1 23.1 0 0 0-7.163 13.829l-3.798 28.146c-.503 3.758-5.782 4.131-6.819.494l-14.607-51.325c-1.673-5.854.765-12.107 5.943-15.303"
      />
    </g>
  </svg>
);

export default TelegramIcon;
