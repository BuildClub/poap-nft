import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Layout from './modules/layout';
import CustomSwitch from './modules/common/components/CustomSwitch';
import Nfts from '@modules/NftInfo';
import UsersNfts from '@modules/UsersNfts';
import Scan from '@modules/Scan';
import Home from '@modules/home';
import About from '@modules/About';
import League from '@modules/League';
import CreateEvent from '@modules/CreateEvent';
import Events from '@modules/Events';
import ForgotPassword from '@modules/ForgotPassword';
import ResetPassword from '@modules/ResetPassword';
import ManageDrop from '@modules/ManageDrop';
import Web3Wrapper from '@modules/web3/containers/Web3Wrapper';
import { QueryClient, QueryClientProvider } from 'react-query';

const modulesData = [
  { path: '/', title: 'home', component: Home },
  { path: '/about', title: 'about', component: About },
  { path: '/league', title: 'league', component: League },
  { path: '/scan', title: 'scan', component: Scan },
  { path: '/nfts/:address/:id', title: 'nfts', component: Nfts },
  { path: '/UserNfts/:address', title: 'usersNfts', component: UsersNfts },
  { path: '/UserNfts', title: 'usersNfts', component: UsersNfts },
  { path: '/createEvent', title: 'usersNfts', component: CreateEvent },
  { path: '/manageDrop', title: 'usersNfts', component: ManageDrop },
  { path: '/events', title: 'events', component: Events },
  { path: '/forgot', title: 'forgot', component: ForgotPassword },
  { path: '/reset/:id', title: 'forgot', component: ResetPassword },
];

const isBrowserSupportsHistory = 'pushState' in window.history;

const queryClient = new QueryClient();

const NoFound = () => <Redirect to="/404" />;

function App() {
  return (
    <BrowserRouter forceRefresh={!isBrowserSupportsHistory}>
      <Web3Wrapper>
        <QueryClientProvider client={queryClient}>
          <Layout>
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
