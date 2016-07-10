import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Drawer, Snackbar} from 'material-ui'
import fs from 'fs'
import path from 'path'
import * as ActionCreators from '../actions'
import GroupContainer from '../containers/group-container'
import HostContainer from '../containers/host-container'
import HostsManager from '../utils/hosts-manager'

function mapStateToProps(state) {
  return {messages: state.messages}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.object.isRequired
  };
  static defaultProps = {
    messages: []
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
      this.props.actions.createGroup({enable: true, name: params.name, hosts})
      this.props.actions.createMessage({text: 'Imported Hosts File'})
    })
  }
  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }
  handleRequestClose() {
    this.props.actions.clearMessages()
  }
  renderSnackbar() {
    const {messages} = this.props

    let open = false
    let text = ''
    if (messages.length) {
      open = true
      text = messages[0].text
    }

    return (
      <Snackbar
        open={open}
        message={text}
        autoHideDuration={4000}
        bodyStyle={styles.snackbar}
        onRequestClose={::this.handleRequestClose}
      />
    )
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
        {this.renderSnackbar()}
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
  },
  snackbar: {
    textAlign: 'center'
  }
}
