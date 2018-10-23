import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import setPropTypes from 'recompose/setPropTypes';

const styles = theme => ({
  textField: {
    margin: theme.spacing.unit * 3
  }
});

const LayoutOptions = ({ classes, values, onInputChange }) => (
  <>
    <TextField
      fullWidth
      type="number"
      id="maxWidth"
      name="maxWidth"
      label="Total Width"
      value={values.maxWidth}
      margin="normal"
      className={classes.textField}
      onChange={onInputChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">px</InputAdornment>
      }}
    />
  </>
);

export default compose(
  setDisplayName('LayoutOptions'),
  setPropTypes({
    classes: PropTypes.object,
    values: PropTypes.shape({
      blockSize: PropTypes.number,
      thickLinesEvery: PropTypes.number,
      lightColor: PropTypes.string,
      darkColor: PropTypes.string
    }),
    onInputChange: PropTypes.func
  })
)(withStyles(styles)(LayoutOptions));
