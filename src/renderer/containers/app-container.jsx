import React from 'react';
import { Drawer } from 'material-ui';
import GroupContainer from './group-container';
import HostContainer from './host-container';

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    height: '100%',
    overflow: 'auto',
    paddingLeft: '256px',
  },
};

const AppContainers = props => (
  <div style={styles.container}>
    <Drawer
      open
      width={256}
      className="sidebar"
    >
      <GroupContainer {...props} />
    </Drawer>
    <div style={styles.content} className="content">
      <HostContainer {...props} />
    </div>
  </div>
);

export default AppContainers;
