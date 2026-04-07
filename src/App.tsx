import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { SidebarProvider } from "./lib/sidebar-context";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { Shipments } from "./pages/Shipments";
import { ShipmentDetail } from "./pages/ShipmentDetail";
import { Settings } from "./pages/Settings";
import { Pickups } from "./pages/Pickups";
import { Orders } from "./pages/Orders";

function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipments/:id" element={<ShipmentDetail />} />
          <Route path="/pickups" element={<Pickups />} />
          <Route path="/tracking" element={<PlaceholderPage title="Tracking" description="Real-time tracking for all your packages." />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" description="Insights and performance metrics for your operations." />} />
          <Route path="/claims" element={<PlaceholderPage title="Claims" description="File and manage shipping claims." />} />
          <Route path="/billing" element={<PlaceholderPage title="Billing" description="Invoices, payment history, and plan details." />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<PlaceholderPage title="Support" description="Get help from the Parsel support team." />} />
          <Route path="/feedback" element={<PlaceholderPage title="Feedback" description="Share your thoughts to help us improve." />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    </BrowserRouter>
  );
}
