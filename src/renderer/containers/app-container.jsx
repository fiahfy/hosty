import React from 'react';
import { Drawer } from 'material-ui';
import GroupContainer from './group-container';
import HostContainer from './host-container';

const styles = {
  container: {
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
  },
  content: {
    overflow: 'auto',
    height: '100%',
    paddingLeft: 256,
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
