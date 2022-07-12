import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { RouteComponentProps } from 'react-router-dom';

interface IRouteChangeTracker {
  history: RouteComponentProps['history'];
}

const RouteChangeTracker = ({ history }: IRouteChangeTracker) => {
  history.listen((location: any, action: any) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });

  return <></>;
};

export default withRouter(RouteChangeTracker);
