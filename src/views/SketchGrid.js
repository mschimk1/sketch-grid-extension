import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'react-sketch-grid';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import setPropTypes from 'recompose/setPropTypes';

import { getGridOptions, isGridVisible } from '../store/selectors';

const SketchGrid = ({ classes, gridVisible, gridOptions }) => (
  <div data-testid="grid" className={classes.root}>
    <div className={classes.container}>
      {/* key forces remount when toggling grid visibility */}
      <Grid key={gridVisible} {...gridOptions} />
    </div>
  </div>
);

const StyledSketchGridWithProps = props =>
  withStyles(
    theme => ({
      root: {
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 16777271,
        margin: 0
      },
      container: {
        maxWidth: props.maxWidth,
        height: '100%',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row'
      }
    }),
    { withTheme: true }
  )(SketchGrid);

const StyledGrid = props => {
  const GridWrapper = StyledSketchGridWithProps({ ...props.gridOptions });
  return <GridWrapper {...props} />;
};

const mapStateToProps = state => ({
  gridVisible: isGridVisible(state),
  gridOptions: getGridOptions(state)
});

const withStore = connect(mapStateToProps);

const EnhancedSketchGrid = compose(
  withStore,
  setDisplayName('SketchGrid'),
  setPropTypes({
    classes: PropTypes.object,
    gridVisible: PropTypes.bool,
    gridOptions: PropTypes.shape({
      blockSize: PropTypes.number,
      thickLinesEvery: PropTypes.number,
      lightColor: PropTypes.string,
      darkColor: PropTypes.string
    })
  })
)(StyledGrid);

export default EnhancedSketchGrid;
