import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyBorrowingChart() {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    colors: ["#4CAF50"],
  };

  const series = [
    {
      name: "Borrowings",
      data: [30, 40, 35, 50, 49, 60],
    },
  ];

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Borrowing Trends</h3>
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
  );
}
