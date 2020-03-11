import React from 'react';
import T from 'prop-types';
import IT from 'react-immutable-proptypes';
import { Layout as AntdLayout } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import GlobalHeader from 'components/GlobalHeader';
import SideMenu from 'components/SideMenu';

import { makeSelectLocation, makeSelectMenu, makeSelectError } from 'containers/App/selectors';

import styles from './MasterLayout.module.scss';

const { Content, Footer } = AntdLayout;

const MasterLayout = ({ children, locationState, menu }) => {
  const collapsed = menu.get('collapsed');
  const isMobile = menu.get('isMobile');
  const currentYear = new Date().getFullYear();

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
      <AntdLayout collapsed={collapsed} isMobile={isMobile}>
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
  children: T.node.isRequired,
  locationState: T.instanceOf(Object).isRequired,
  menu: IT.map.isRequired,
};

export const mapStateToProps = createStructuredSelector({
  locationState: makeSelectLocation(),
  menu: makeSelectMenu(),
  globalError: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    logoutUser: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(logoutUserAction());
    },
    setMenu: (...params) => {
      dispatch(portalActions.setMenu(...params));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MasterLayout);
