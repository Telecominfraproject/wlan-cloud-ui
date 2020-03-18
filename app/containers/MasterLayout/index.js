import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GlobalHeader from 'cu-ui/app/components/GlobalHeader';
import SideMenu from 'cu-ui/app/components/SideMenu';

import { useInjectReducer } from 'utils/injectReducer';

import { makeSelectLocation, makeSelectError } from 'containers/App/selectors';

import { setMenu } from './actions';
import { STATE_KEY } from './constants';
import { makeSelectCollapsed, makeSelectIsMobile, makeSelectScreen } from './selectors';
import reducer from './reducer';
import styles from './MasterLayout.module.scss';

npm;
const { Content, Footer } = Layout;

const MasterLayout = ({ children, locationState, collapsed, isMobile, screen, onSetMenu }) => {
  useInjectReducer({ key: STATE_KEY, reducer });

  const currentYear = new Date().getFullYear();

  const handleResize = () => {
    const width = window.innerWidth;

    if (width < 768 && screen !== 'sm') {
      onSetMenu({
        collapsed: true,
        isMobile: true,
        screen: 'sm',
      });
    } else if (width >= 768 && width < 992 && screen !== 'md') {
      onSetMenu({
        collapsed: true,
        isMobile: false,
        screen: 'md',
      });
    } else if (width >= 992 && screen !== 'lg') {
      onSetMenu({
        collapsed: false,
        isMobile: false,
        screen: 'lg',
      });
    }
  };

  const handleMenuToggle = () => {
    onSetMenu({
      isMobile,
      screen,
      collapsed: !collapsed,
    });

    // Highcharts will only resize with a Timeout
    window.setTimeout(() => {
      // window.dispatchEvent(new Event('resize'));
    }, 10);
  };

  const handleMenuItemClick = () => {
    if (isMobile === true) {
      onSetMenu({
        isMobile,
        screen,
        collapsed: true,
      });
    }
  };

  const handleLogout = () => {
    // logoutUser();
  };

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [screen]);

  return (
    <Layout>
      <SideMenu
        locationState={locationState}
        collapsed={collapsed}
        isMobile={isMobile}
        onMenuButtonClick={handleMenuToggle}
        onMenuItemClick={handleMenuItemClick}
        onLogout={handleLogout}
      />
      <Layout
        className={`${styles.MainLayout} ${collapsed ? styles.collapsed : ''} ${
          isMobile ? styles.mobile : ''
        }`}
      >
        <GlobalHeader
          collapsed={collapsed}
          isMobile={isMobile}
          onMenuButtonClick={handleMenuToggle}
        />
        <Content className={styles.Content}>{children}</Content>
        <Footer className={styles.Footer}>
          Copyright © {currentYear} ConnectUs Inc. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
  locationState: PropTypes.instanceOf(Object).isRequired,
  collapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  screen: PropTypes.string.isRequired,
  onSetMenu: PropTypes.func.isRequired,
};

export const mapStateToProps = createStructuredSelector({
  locationState: makeSelectLocation(),
  globalError: makeSelectError(),
  collapsed: makeSelectCollapsed(),
  isMobile: makeSelectIsMobile(),
  screen: makeSelectScreen(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetMenu: (...params) => dispatch(setMenu(...params)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(MasterLayout);
