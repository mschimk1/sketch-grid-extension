import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import setDisplayName from 'recompose/setDisplayName';
import setPropTypes from 'recompose/setPropTypes';

import GridOptions from './GridOptions';
import LayoutOptions from './LayoutOptions';
import { isOptionsView } from '../utils/browser';

const styles = theme => ({
  root: {
    width: theme.spacing.unit * 40,
    backgroundColor: '#fff'
  },
  container: {
    paddingBottom: theme.spacing.unit * 3
  },
  tabs: {
    backgroundColor: '#f5f5f5'
  },
  tab: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1
  },
  pickerButtons: {
    marginLeft: theme.spacing.unit * 2
  },
  textField: {
    margin: theme.spacing.unit * 3
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  button: {
    display: 'flex',
    flexGrow: '1',
    margin: theme.spacing.unit * 3
  }
});

const GridOptionsTab = ({ classes, values, fullView, onRestoreDefaults, onChange }) => (
  <div className={classes.tab}>
    <GridOptions values={values} onInputChange={onChange} onColorChange={onChange} />
    {fullView && (
      <Button className={classes.button} onClick={onRestoreDefaults} variant="outlined">
        Restore Defaults
      </Button>
    )}
  </div>
);

const LayoutOptionsTab = ({ classes, values, onChange }) => (
  <div className={classes.tab}>
    <LayoutOptions values={values} onInputChange={onChange} />
  </div>
);

const CurrentTab = branch(
  ({ currentTab }) => currentTab === 0,
  renderComponent(GridOptionsTab),
  renderComponent(LayoutOptionsTab)
)();

const TabsContainer = props => (
  <div className={props.classes.container}>
    <Tabs className={props.classes.tabs} value={props.currentTab} onChange={props.handleTabChange}>
      <Tab label="Grid" />
      <Tab label="Layout" />
    </Tabs>
    <CurrentTab {...props} />
  </div>
);

const GridOptionsForm = props => (
  <form className={props.classes.root} noValidate autoComplete="off">
    <TabsContainer {...props} />
  </form>
);

export default compose(
  setDisplayName('GridOptionsForm'),
  setPropTypes({
    classes: PropTypes.object,
    view: PropTypes.string,
    values: PropTypes.shape({
      blockSize: PropTypes.number,
      thickLinesEvery: PropTypes.number,
      lightColor: PropTypes.string,
      darkColor: PropTypes.string
    }),
    onChange: PropTypes.func,
    onRestoreDefaults: PropTypes.func
  }),
  withProps(({ view }) => ({
    fullView: isOptionsView({ view })
  })),
  withState('currentTab', 'setCurrentTab', 0),
  withHandlers({
    handleTabChange: ({ setCurrentTab }) => (_, value) => {
      setCurrentTab(value);
    }
  })
)(withStyles(styles)(GridOptionsForm));
