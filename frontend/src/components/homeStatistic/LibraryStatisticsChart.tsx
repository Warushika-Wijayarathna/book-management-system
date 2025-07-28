import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { dashboardService, LibraryStatistics } from "../../services/dashboardService";

export default function LibraryStatisticsChart() {
  const [chartData, setChartData] = useState<LibraryStatistics>({
    categories: [],
    borrowings: [],
    returns: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getLibraryStatistics();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching library statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
    },
    xaxis: {
      categories: chartData.categories,
    },
    colors: ["#3B82F6", "#1E40AF"],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 4
    }
  };

  const series = [
    {
      name: "Borrowings",
      data: chartData.borrowings,
    },
    {
      name: "Returns",
      data: chartData.returns,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold mb-4">Library Statistics</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Library Statistics</h3>
        <Chart options={options} series={series} type="line" height={300} />
      </div>
  );
}
