import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ModalProvider, useModalContext } from "../context/ModalContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isModalOpen } = useModalContext();

  return (
    <div className="min-h-screen xl:flex relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-60 z-[99998] pointer-events-none" />
      )}
      <div>
        <AppSidebar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <ModalProvider>
        <LayoutContent />
      </ModalProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
