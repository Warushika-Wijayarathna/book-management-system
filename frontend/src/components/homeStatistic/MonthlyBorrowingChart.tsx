import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { dashboardService, MonthlyTrends } from "../../services/dashboardService";

export default function MonthlyBorrowingChart() {
  const [chartData, setChartData] = useState<MonthlyTrends>({
    categories: [],
    data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getMonthlyBorrowingTrends();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching monthly borrowing trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
    },
    xaxis: {
      categories: chartData.categories,
    },
    colors: ["#3B82F6"], // Changed from green to blue
    title: {
      text: `Total Borrowings: ${chartData.data.reduce((sum, val) => sum + val, 0)}`,
      style: {
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#666'
      }
    }
  };

  const series = [
    {
      name: "Borrowings",
      data: chartData.data,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold mb-4">Monthly Borrowing Trends</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Borrowing Trends</h3>
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
  );
}
