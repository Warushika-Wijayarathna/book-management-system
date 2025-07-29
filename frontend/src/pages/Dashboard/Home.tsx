import LibraryMetrics from "../../components/homeStatistic/LibraryMetrics.tsx";
import MonthlyBorrowingChart from "../../components/homeStatistic/MonthlyBorrowingChart.tsx";
import RecentBorrowedBooks from "../../components/homeStatistic/RecentBorrowedBooks.tsx";
import GenreDemographicCard from "../../components/homeStatistic/GenreDemographicCard.tsx";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | BookClub"
        description="This is Dashboard page for BookClub"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-6 space-y-6">
          <LibraryMetrics/>
          <MonthlyBorrowingChart/>
        </div>

        <div className="col-span-12 xl:col-span-6 space-y-6">
          <RecentBorrowedBooks/>
          <GenreDemographicCard/>
        </div>
      </div>
    </>
  );
}
