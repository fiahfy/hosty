import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Drawer} from 'material-ui'
import fs from 'fs'
import path from 'path'
import * as ActionCreators from '../actions'
import GroupContainer from '../containers/group-container'
import HostContainer from '../containers/host-container'
import HostsManager from '../utils/hosts-manager'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    actions:  PropTypes.object.isRequired
  };
  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    Array.from(e.dataTransfer.files).forEach(file => {
      const params = path.parse(file.path)
      const data = fs.readFileSync(file.path, 'utf8')
      let hosts = HostsManager.parseHosts(data)
      if (!hosts.length) {
        return
      }
      hosts = hosts.map((host, i) => {
        host.id = i + 1
        return host
      })
      this.props.actions.createGroup({name: params.name, hosts})
    })
  }
  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }
  render() {
    const {sidebar, content} = this.props

    return (
      <div
        style={styles.app}
        onDragOver={::this.handleDragOver}
        onDrop={::this.handleDrop}
      >
        <Drawer
          open={true}
          width={256}
          ref="drawer"
          className="sidebar"
        >
          {sidebar}
        </Drawer>
        <div style={styles.content} className="content">
          {content}
        </div>
      </div>
    )
  }
}

const styles = {
  app: {
    // WebkitUserSelect: 'none',
    // paddingBottom: 56,
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box'
  },
  content: {
    overflow: 'auto',
    height: '100%',
    paddingLeft: 256
  }
}
