import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Jobs from './pages/Jobs/Jobs';
import JobDetail from './pages/JobDetail/JobDetail';
import Applicants from './pages/Applicants/Applicants';
import AllApplicants from './pages/AllApplicants/AllApplicants';
import Screening from './pages/Screening/Screening';
import Screenings from './pages/Screenings/Screenings';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/applicants" element={<Applicants />} />
          <Route path="/applicants" element={<AllApplicants />} />
          <Route path="/jobs/:id/screening" element={<Screening />} />
          <Route path="/screenings" element={<Screenings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
