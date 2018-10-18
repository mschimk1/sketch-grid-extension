import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import GridOptionsForm from '../components/GridOptionsForm';
import { toggleGrid, setOptions } from '../store/actions';
import { isGridVisible, getGridOptions } from '../store/selectors';

const styles = theme => ({
  root: {
    width: theme.spacing.unit * 40,
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  actionButton: {
    padding: theme.spacing.unit / 2
  },
  helpContainer: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    backgroundColor: '#f5f5f5'
  }
});

const Popup = ({
  actions,
  classes,
  gridVisible,
  gridOptions,
  showHelp,
  toggleHelp,
  showOptions,
  toggleOptions,
  handleOptionsChange
}) => (
  <AppBar data-testid="popup" className={classes.root} position="static" color="default">
    <Toolbar className={classes.toolbar} variant="dense">
      <Typography variant="title" color="inherit" className={classes.grow}>
        Sketch Grid
      </Typography>
      <Switch checked={gridVisible} onChange={() => actions.toggleGrid(gridVisible)} value="showGrid" color="primary" />
      <IconButton className={classes.actionButton} color="inherit" aria-label="Help">
        <HelpIcon onClick={toggleHelp} />
      </IconButton>
      <IconButton className={classes.actionButton} color="inherit" aria-label="Options">
        <SettingsIcon onClick={toggleOptions} />
      </IconButton>
    </Toolbar>
    <Collapse in={showHelp} className={classes.helpContainer}>
      <Typography align="left" variant="subheading" color="inherit">
        Baseline Grid
      </Typography>
    </Collapse>
    <Collapse in={showOptions}>
      <GridOptionsForm view={'popup'} values={gridOptions} onChange={handleOptionsChange} />
    </Collapse>
  </AppBar>
);

const mapStateToProps = state => ({
  gridVisible: isGridVisible(state),
  gridOptions: getGridOptions(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ toggleGrid, setOptions }, dispatch)
});

const withStore = connect(
  mapStateToProps,
  mapDispatchToProps
);

const enhance = compose(
  withStore,
  setDisplayName('Popup'),
  withState('showHelp', 'toggleHelp', false),
  withState('showOptions', 'toggleOptions', false),
  withHandlers({
    toggleHelp: ({ toggleHelp, toggleOptions }) => e => !toggleHelp(current => !current) && toggleOptions(false),
    toggleOptions: ({ toggleOptions, toggleHelp }) => e => !toggleOptions(current => !current) && toggleHelp(false),
    handleOptionsChange: ({ actions: { setOptions }, gridOptions }) => e => {
      setOptions({ ...gridOptions, ...{ [e.target.name]: e.target.value } });
    }
  })
);

export default withStyles(styles)(enhance(Popup));
