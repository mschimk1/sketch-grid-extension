import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import setDisplayName from 'recompose/setDisplayName';

import ColorPicker from './ColorPicker';
import initStorage from '../utils/initStorage';
import { isOptionsView } from '../utils/browser';

const styles = theme => ({
  root: {
    display: 'flex',
    width: theme.spacing.unit * 40,
    flexGrow: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
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

const GridOptionsForm = ({
  classes,
  values = initStorage.options,
  handleColorChange,
  handleInputChange,
  onRestoreDefaults,
  fullView
}) => (
  <form className={classes.root} noValidate autoComplete="off">
    <div className={classes.container}>
      <TextField
        fullWidth
        type="number"
        id="blockSize"
        name="blockSize"
        label="Grid block size"
        value={values.blockSize}
        margin="normal"
        className={classes.textField}
        onChange={handleInputChange}
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
        onChange={handleInputChange}
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
      {fullView && (
        <Button className={classes.button} onClick={onRestoreDefaults} variant="outlined">
          Restore Defaults
        </Button>
      )}
    </div>
  </form>
);

GridOptionsForm.propTypes = {
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
};

export default compose(
  setDisplayName('GridOptionsForm'),
  withProps(({ view }) => ({
    fullView: isOptionsView({ view })
  })),
  withHandlers({
    handleInputChange: ({ onChange }) => e => {
      onChange(e);
    },
    handleColorChange: ({ onChange }) => name => (color, e) => {
      e.target.name = name;
      e.target.value = color;
      onChange(e);
    }
  })
)(withStyles(styles)(GridOptionsForm));
