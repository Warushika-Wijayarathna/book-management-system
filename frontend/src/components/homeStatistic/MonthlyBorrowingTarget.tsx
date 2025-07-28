import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { dashboardService, MonthlyTarget } from "../../services/dashboardService";

export default function MonthlyBorrowingTarget() {
  const [targetData, setTargetData] = useState<MonthlyTarget>({
    current: 0,
    target: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getMonthlyTarget();
        setTargetData(data);
      } catch (error) {
        console.error('Error fetching monthly target:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const series = [Math.min(targetData.percentage, 100)];
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
            fontSize: "32px",
            fontWeight: "bold",
            formatter: () => `${targetData.percentage}%`,
          },
          name: {
            show: false,
          }
        },
      },
    },
    colors: [targetData.percentage > 100 ? "#1D4ED8" : "#3B82F6"],
    labels: [`${targetData.current}/${targetData.target}`]
  };

  if (loading) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Borrowing Target</h3>
        <p className="text-gray-500 mb-4">Target for this month</p>
        <div className="animate-pulse">
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isOverTarget = targetData.percentage > 100;

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Borrowing Target</h3>
        <p className="text-gray-500">Target for this month</p>
        <div className="mt-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Current: {targetData.current}</span>
            <span>Target: {targetData.target}</span>
          </div>
          {isOverTarget && (
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                🎉 Target exceeded by {Math.round((targetData.percentage - 100) * 100) / 100}%!
              </span>
            </div>
          )}
        </div>
        <Chart options={options} series={series} type="radialBar" height={330} />
      </div>
  );
}
