import LibraryMetrics from "../../components/homeStatistic/LibraryMetrics.tsx";
import MonthlyBorrowingChart from "../../components/homeStatistic/MonthlyBorrowingChart.tsx";
import LibraryStatisticsChart from "../../components/homeStatistic/LibraryStatisticsChart.tsx";
import MonthlyBorrowingTarget from "../../components/homeStatistic/MonthlyBorrowingTarget.tsx";
import RecentBorrowedBooks from "../../components/homeStatistic/RecentBorrowedBooks.tsx";
import GenreDemographicCard from "../../components/homeStatistic/GenreDemographicCard.tsx";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <LibraryMetrics/>

          <MonthlyBorrowingChart/>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyBorrowingTarget/>
        </div>

        <div className="col-span-12">
          <LibraryStatisticsChart/>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentBorrowedBooks/>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <GenreDemographicCard/>
        </div>
      </div>
    </>
  );
}
