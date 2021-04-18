import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import routes from 'routes';
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <Redirect to="/users" />
              )
            }}
          />
          {routes.map((route, idx) => {
            return (<Route
              key={idx}
              path={route.path}
              exact={route.exact}
              render={(props: RouteComponentProps<any>) => (
                <route.component
                  name={route.name}
                  {...props}
                  {...route.props}
                />
              )}
            />)
          })}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
