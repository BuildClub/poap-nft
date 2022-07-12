import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Layout from './modules/layout';
import CustomSwitch from './modules/common/components/CustomSwitch';
import Nfts from '@modules/NftInfo';
import UsersNfts from '@modules/UsersNfts';
import Scan from '@modules/Scan';
import CreateEvent from '@modules/CreateEvent';
import ManageDrop from '@modules/ManageDrop';
import Web3Wrapper from '@modules/web3/containers/Web3Wrapper';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactGA from 'react-ga';
import RouteChangeTracker from '@modules/common/components/RouteChangeTracker';

const modulesData = [
  { path: '/', title: 'home', component: Scan },
  { path: '/nfts/:address/:id', title: 'nfts', component: Nfts },
  { path: '/UserNfts/:address', title: 'usersNfts', component: UsersNfts },
  { path: '/createEvent', title: 'usersNfts', component: CreateEvent },
  { path: '/manageDrop', title: 'usersNfts', component: ManageDrop },
];

const isBrowserSupportsHistory = 'pushState' in window.history;

const queryClient = new QueryClient();

const NoFound = () => <Redirect to="/404" />;

function App() {
  const TRACKING_ID = 'G-75PYJFZSVN';
  ReactGA.initialize(TRACKING_ID);

  return (
    <BrowserRouter forceRefresh={!isBrowserSupportsHistory}>
      <Web3Wrapper>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <RouteChangeTracker />
            <CustomSwitch>
              {modulesData.map(({ path, title, component }) => (
                <Route exact key={title} path={path} component={component} />
              ))}
              <Route component={NoFound} key="pageNotFound" />
            </CustomSwitch>
          </Layout>
        </QueryClientProvider>
      </Web3Wrapper>
    </BrowserRouter>
  );
}

export default App;
