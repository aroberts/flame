import { useSelector } from 'react-redux';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

import { Route as SettingsRoute } from '../../interfaces';
import { State } from '../../store/reducers';
import { ProtectedRoute } from '../Routing/ProtectedRoute';
import { Container, Headline } from '../UI';
import { AppDetails } from './AppDetails/AppDetails';
import { DockerSettings } from './DockerSettings/DockerSettings';
import { GeneralSettings } from './GeneralSettings/GeneralSettings';
import clientRoutes from './settings.json';
import classes from './Settings.module.css';
import { StyleSettings } from './StyleSettings/StyleSettings';
import { Themer } from './Themer/Themer';
import { UISettings } from './UISettings/UISettings';
import { WeatherSettings } from './WeatherSettings/WeatherSettings';

// Redux
// Typescript
// CSS
// Components
// UI
// Data
export const Settings = (): JSX.Element => {
  const routes = clientRoutes.routes;

  const { isAuthenticated } = useSelector((state: State) => state.auth);

  const tabs = isAuthenticated ? routes : routes.filter((r) => !r.authRequired);

  return (
    <Container>
      <Headline title="Settings" subtitle={<Link to="/">Go back</Link>} />
      <div className={classes.Settings}>
        {/* NAVIGATION MENU */}
        <nav className={classes.SettingsNav}>
          {tabs.map(({ name, dest }: SettingsRoute, idx) => (
            <NavLink
              className={({ isActive }) => {
                const linkClasses = [classes.SettingsNavLink];
                if (isActive) linkClasses.push(classes.SettingsNavLinkActive);
                
                return linkClasses.join(" ");
              }}
              end
              to={dest}
              key={idx}
            >
              {name}
            </NavLink>
          ))}
        </nav>

        {/* ROUTES */}
        <section className={classes.SettingsContent}>
          <Routes>
            <Route path="" element={<Themer/>} />
          </Routes>
        </section>
      </div>
    </Container>
  );
};
