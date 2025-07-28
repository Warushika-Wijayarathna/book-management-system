import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { dashboardService, GenreStatistic } from "../../services/dashboardService";

export default function GenreDemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [genreData, setGenreData] = useState<GenreStatistic[]>([]);
  const [loading, setLoading] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getGenreStatistics();
        setGenreData(data);
      } catch (error) {
        console.error('Error fetching genre statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: genreData.map(item => item.genre),
    colors: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'], // Changed to blue shades
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Books',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString()
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + '%'
      }
    }
  };

  const chartSeries = genreData.map(item => item.count);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Books by Genre
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Number of books based on genre
            </p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Books by Genre
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Number of books based on genre ({genreData.reduce((total, item) => total + item.count, 0)} total)
            </p>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="w-40 p-2"
            >
              <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Export Data
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {genreData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg">No genre data available</p>
              <p className="text-sm">Add books with genres to see the distribution</p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={300}
            />
          </div>
        )}
      </div>
  );
}
