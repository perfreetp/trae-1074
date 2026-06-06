import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Enterprise from './pages/Enterprise';
import EnterpriseDetail from './pages/Enterprise/EnterpriseDetail';
import RiskSource from './pages/RiskSource';
import WorkTicket from './pages/WorkTicket';
import WorkTicketDetail from './pages/WorkTicket/WorkTicketDetail';
import Inspection from './pages/Inspection';
import Incident from './pages/Incident';
import Reports from './pages/Reports';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/enterprise/:id" element={<EnterpriseDetail />} />
        <Route path="/risk" element={<RiskSource />} />
        <Route path="/ticket" element={<WorkTicket />} />
        <Route path="/ticket/:id" element={<WorkTicketDetail />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/incident" element={<Incident />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  );
}

export default App;
