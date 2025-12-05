import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './views/MainApp';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainApp />} />
    </Routes>
  </Router>
);

export default App;
