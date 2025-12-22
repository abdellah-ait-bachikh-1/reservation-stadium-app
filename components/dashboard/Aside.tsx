"use client";
import { useSidebar } from "@/components/provider/SidebarProvider";
import { useEffect, useRef } from "react";

const Aside = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden " />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed md:sticky top-0 left-0
          w-64
          h-screen
          transform transition-transform duration-300 ease-in-out
          
          z-50 md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="bg-amber-50 dark:bg-slate-900 h-full">
          <button
            onClick={closeSidebar}
            className="md:hidden absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900"
          >
            ✕
          </button>
          Aside
        </div>
      </div>
    </>
  );
};

export default Aside;
