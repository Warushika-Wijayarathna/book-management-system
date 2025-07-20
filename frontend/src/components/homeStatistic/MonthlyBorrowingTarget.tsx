import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyBorrowingTarget() {
  const series = [75.55];
  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 330,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          value: {
            fontSize: "36px",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ["#4CAF50"],
  };

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Borrowing Target</h3>
        <p className="text-gray-500">Target for this month</p>
        <Chart options={options} series={series} type="radialBar" height={330} />
      </div>
  );
}
