import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import setDisplayName from 'recompose/setDisplayName';

import GridOptionsForm from '../components/GridOptionsForm';
import { setOptions, updateState } from '../store/actions';
import { getGridOptions } from '../store/selectors';
import initStorage from '../utils/initStorage';

const styles = theme => ({
  root: {
    margin: 'auto',
    width: theme.spacing.unit * 40,
    flexGrow: 1,
    textAlign: 'center'
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

const GridOptions = ({ classes, gridOptions, handleOptionsChange, handleRestoreDefaults }) => (
  <AppBar data-testid="options" className={classes.root} position="static" color="default">
    <Toolbar className={classes.toolbar}>
      <Typography variant="title" color="inherit" className={classes.grow}>
        Sketch Grid Options
      </Typography>
    </Toolbar>
    <GridOptionsForm
      view={'options'}
      values={gridOptions}
      onChange={handleOptionsChange}
      onRestoreDefaults={handleRestoreDefaults}
    />
  </AppBar>
);

GridOptionsForm.propTypes = {
  class: PropTypes.object,
  gridOptions: PropTypes.shape({
    blockSize: PropTypes.number,
    thickLinesEvery: PropTypes.number,
    lightColor: PropTypes.string,
    darkColor: PropTypes.string
  }),
  handleOptionsChange: PropTypes.func
};

const mapStateToProps = state => ({
  gridOptions: getGridOptions(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setOptions, updateState }, dispatch)
});

const withStore = connect(
  mapStateToProps,
  mapDispatchToProps
);

const enhance = compose(
  withStore,
  setDisplayName('GridOptions'),
  withHandlers({
    handleOptionsChange: ({ actions: { setOptions }, gridOptions }) => e => {
      setOptions({ ...gridOptions, ...{ [e.target.name]: e.target.value } });
    },
    handleRestoreDefaults: ({ actions: { updateState } }) => () => {
      const { options } = initStorage;
      updateState({ options });
    }
  })
);

export default withStyles(styles)(enhance(GridOptions));
