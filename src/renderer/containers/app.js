import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Drawer, Snackbar } from 'material-ui'
import fs from 'fs'
import path from 'path'
import * as ActionCreators from '../actions'
import * as HostGroup from '../utils/host-group'
import * as Host from '../utils/host'
import * as ContextMenu from '../utils/context-menu'

function mapStateToProps(state) {
  return { messages: state.messages }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.object.isRequired,
    sidebar: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
  };
  static defaultProps = {
    messages: [],
  };
  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    const groups = Array.from(e.dataTransfer.files)
      .map(file => {
        const params = path.parse(file.path)
        const data = fs.readFileSync(file.path, 'utf8')
        let hosts = Host.parse(data)
        if (!hosts.length) {
          return null
        }
        hosts = hosts.map((host, i) => {
          const newHost = Object.assign({}, host)
          newHost.id = i + 1
          return newHost
        })
        return { enable: true, name: params.name, hosts }
      })
      .filter(item => !!item)

    groups.forEach(group => {
      this.props.actions.createGroup(group)
    })

    const groupLength = groups.length
    const hostLength = HostGroup.getHostLength(groups)
    this.props.actions.createMessage(
      { text: `Added ${groupLength} group(s), ${hostLength} host(s)` }
    )
  }
  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy' // eslint-disable-line no-param-reassign
  }
  handleRequestClose() {
    this.props.actions.clearMessages()
  }
  handleContextMenu(e) {
    ContextMenu.show(e)
  }
  renderSnackbar() {
    const { messages } = this.props

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
    const { sidebar, content } = this.props

    return (
      <div
        style={styles.app}
        onDragOver={::this.handleDragOver}
        onDrop={::this.handleDrop}
        onContextMenu={::this.handleContextMenu}
      >
        <Drawer
          open
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
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
  },
  content: {
    overflow: 'auto',
    height: '100%',
    paddingLeft: 256,
  },
  snackbar: {
    textAlign: 'center',
  },
}
