import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout as AntdLayout } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';

import GlobalHeader from 'components/GlobalHeader';
import SideMenu from 'components/SideMenu';

import { makeSelectLocation, makeSelectError } from 'containers/App/selectors';

import { setMenu } from './actions';
import { STATE_KEY } from './constants';
import { makeSelectMenu } from './selectors';
import reducer from './reducer';
import styles from './MasterLayout.module.scss';

const { Content, Footer } = AntdLayout;

const MasterLayout = ({ children, locationState, menu, onSetMenu }) => {
  useInjectReducer({ key: STATE_KEY, reducer });

  const { collapsed, isMobile, screen } = menu;
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
      ...menu,
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
        ...menu,
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

  return (
    <AntdLayout>
      <SideMenu
        locationState={locationState}
        collapsed={collapsed}
        isMobile={isMobile}
        onMenuButtonClick={handleMenuToggle}
        onMenuItemClick={handleMenuItemClick}
        onLogout={handleLogout}
      />
      <AntdLayout
        className={`${styles.MainLayout} ${collapsed ? styles.collapsed : ''} ${
          isMobile ? styles.mobile : ''
        }`}
        collapsed={collapsed}
        isMobile={isMobile}
      >
        <GlobalHeader
          collapsed={collapsed}
          onMenuButtonClick={handleMenuToggle}
          isMobile={isMobile}
        />
        <Content>{children}</Content>
        <Footer className={styles.Footer}>
          Copyright © {currentYear} ConnectUs Inc. All Rights Reserved.
        </Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

MasterLayout.propTypes = {
  children: PropTypes.node.isRequired,
  locationState: PropTypes.instanceOf(Object).isRequired,
  menu: PropTypes.instanceOf(Object).isRequired,
  onSetMenu: PropTypes.func.isRequired,
};

export const mapStateToProps = createStructuredSelector({
  locationState: makeSelectLocation(),
  globalError: makeSelectError(),
  menu: makeSelectMenu(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetMenu: (...params) => dispatch(setMenu(...params)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MasterLayout);
