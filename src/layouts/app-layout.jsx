// import Header from "@/components/header";
// import { Outlet } from "react-router-dom";

// const AppLayout = () => {
//   return (
//     <div>
//       <div className="grid-background"></div>
//       <main className="min-h-screen container">
//         <Header />
//         <Outlet />
//       </main>
//       <div className="p-10 text-center bg-gray-800 mt-10">
//         Made with 💗 By Vinayak Vin
//       </div>
//     </div>
//   );
// };

// export default AppLayout;
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative">
      <div className="grid-background fixed top-0 left-0 w-full h-full -z-10"></div>
      <main className="min-h-screen container mx-auto relative z-0">
        <Header />
        <Outlet />
      </main>
      <footer className="p-6 sm:p-10 text-center bg-gray-800 mt-10">
        Made with 💗 By Vinayak Vin
      </footer>
    </div>
  );
};

export default AppLayout;