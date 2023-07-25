import { useSelector } from 'react-redux';
import { Link, NavLink, Route, Switch } from 'react-router-dom';

import { Route as SettingsRoute } from '../../interfaces';
import { State } from '../../store/reducers';
import { ProtectedRoute } from '../Routing/ProtectedRoute';
import { Container, Headline } from '../UI';
import { AppDetails } from './AppDetails/AppDetails';
import { DockerSettings } from './DockerSettings/DockerSettings';
import { GeneralSettings } from './GeneralSettings/GeneralSettings';
import settings from './settings.json';
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
  const { isAuthenticated } = useSelector((state: State) => state.auth);

  const tabs = isAuthenticated ? settings.routes : settings.routes.filter((r) => !r.authRequired);

  return (
    <Container>
      <Headline title="Settings" subtitle={<Link to="/">Go back</Link>} />
      <div className={classes.Settings}>
        {/* NAVIGATION MENU */}
        <nav className={classes.SettingsNav}>
          {tabs.map(({ name, dest }: SettingsRoute, idx) => (
            <NavLink
              className={classes.SettingsNavLink}
              activeClassName={classes.SettingsNavLinkActive}
              exact
              to={dest}
              key={idx}
            >
              {name}
            </NavLink>
          ))}
        </nav>

        {/* ROUTES */}
        <section className={classes.SettingsContent}>
          <Switch>
            <Route exact path="/settings" component={Themer} />
          </Switch>
        </section>
      </div>
    </Container>
  );
};
