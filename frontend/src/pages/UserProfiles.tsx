import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ProfilePage from "../components/UserProfile/ProfilePage";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Profile | BookClub "
        description="This is Profile page for BookClub"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <ProfilePage />
    </>
  );
}
