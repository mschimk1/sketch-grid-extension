import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import setPropTypes from 'recompose/setPropTypes';
import withHandlers from 'recompose/withHandlers';

import ColorPicker from './ColorPicker';

const styles = theme => ({
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
  }
});

const GridOptions = ({ classes, values, onInputChange, handleColorChange }) => (
  <>
    <TextField
      fullWidth
      type="number"
      id="blockSize"
      name="blockSize"
      label="Grid block size"
      value={values.blockSize}
      margin="normal"
      className={classes.textField}
      onChange={onInputChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">px</InputAdornment>
      }}
    />
    <TextField
      fullWidth
      type="number"
      id="thickLinesEvery"
      name="thickLinesEvery"
      label="Thick lines every"
      value={values.thickLinesEvery}
      margin="normal"
      className={classes.textField}
      onChange={onInputChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">blocks</InputAdornment>
      }}
    />
    <FormControl component="fieldset" className={classes.formControl}>
      <FormGroup row>
        <FormControlLabel
          labelPlacement="start"
          label="Colors:"
          control={
            <div className={classes.pickerButtons}>
              <ColorPicker
                name="darkColor"
                helperText="Dark"
                defaultValue={values.darkColor}
                onChange={handleColorChange('darkColor')}
              />
              <ColorPicker
                name="lightColor"
                helperText="Light"
                defaultValue={values.lightColor}
                onChange={handleColorChange('lightColor')}
              />
            </div>
          }
        />
      </FormGroup>
    </FormControl>
  </>
);

export default compose(
  setDisplayName('GridOptions'),
  setPropTypes({
    classes: PropTypes.object,
    values: PropTypes.shape({
      blockSize: PropTypes.number,
      thickLinesEvery: PropTypes.number,
      lightColor: PropTypes.string,
      darkColor: PropTypes.string
    }),
    onInputChange: PropTypes.func,
    onColorChange: PropTypes.func
  }),
  withHandlers({
    handleColorChange: ({ onColorChange }) => name => (color, e) => {
      e.target.name = name;
      e.target.value = color;
      onColorChange(e);
    }
  })
)(withStyles(styles)(GridOptions));
