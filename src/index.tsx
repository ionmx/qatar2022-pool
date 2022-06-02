import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MatchesProvider } from "./context/MatchesContext";
import App from "./App";
import Rules from "./routes/rules";
import SignIn from "./routes/signin";
import Matches from "./routes/matches";
import Circles from "./routes/circles";
import UserProfile from "./routes/user-profile";
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthProvider>
    <MatchesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="rules" element={<Rules />} />
          <Route path="matches" element={<Matches />} />
          <Route path="circles" element={<Circles />} />
          <Route path="user">
            <Route path=":id" element={<UserProfile />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </MatchesProvider>
  </AuthProvider>
);

// reportWebVitals();