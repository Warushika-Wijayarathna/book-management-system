import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function LibraryStatisticsChart() {
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    colors: ["#4CAF50", "#FF5722"],
  };

  const series = [
    {
      name: "Borrowings",
      data: [30, 40, 35, 50, 49, 60],
    },
    {
      name: "Returns",
      data: [20, 30, 25, 40, 39, 50],
    },
  ];

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Library Statistics</h3>
        <Chart options={options} series={series} type="line" height={300} />
      </div>
  );
}
