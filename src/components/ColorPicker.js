import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { withStyles } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import branch from 'recompose/branch';
import pure from 'recompose/pure';
import renderComponent from 'recompose/renderComponent';

const PickerContainer = () => <div />;

const PickerButton = ({ classes, helperText, onClick }) => (
  <>
    <div data-testid="picker-button" className={classes.button} onClick={onClick}>
      <div className={classes.color} />
      <FormHelperText>{helperText}</FormHelperText>
    </div>
  </>
);

PickerButton.propTypes = {
  classes: PropTypes.object,
  onClick: PropTypes.func,
  helperText: PropTypes.string
};

const PickerDialog = ({ classes, color, onChange, onClose }) => (
  <div data-testid="picker-dialog" className={classes.popover}>
    <div className={classes.cover} onClick={onClose} />
    <SketchPicker color={color} onChange={onChange} />
  </div>
);

PickerDialog.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

const enhancedDialog = compose(
  withState('color', 'setValue', ({ color }) => color),
  withHandlers({
    onChange: ({ onChange, setValue }) => (color, e) => {
      setValue(color.rgb);
      onChange(formatColor(color.rgb), e);
    }
  }),
  pure
);

export const Picker = branch(
  ({ pickerVisible }) => pickerVisible,
  renderComponent(enhancedDialog(PickerDialog)),
  renderComponent(PickerButton)
)(PickerContainer);

const StyledWithThemeProps = props =>
  withStyles(
    theme => ({
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: props.color
      },
      button: {
        position: 'relative',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.42)',
        display: 'inline-block',
        cursor: 'pointer',
        marginRight: theme.spacing.unit,
        '&:hover, &:focus': { border: '1px solid rgba(0, 0, 0, 0.87)' }
      },
      popover: {
        position: 'fixed',
        top: '52px',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }),
    { withTheme: true }
  )(Picker);

const formatColor = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`;

const ColorPicker = ({
  helperText,
  onChange,
  // State
  pickerVisible,
  showPicker,
  hidePicker,
  defaultValue
}) => {
  const StyledPicker = StyledWithThemeProps({ color: defaultValue });
  return (
    <StyledPicker
      helperText={helperText}
      onClick={showPicker}
      onChange={onChange}
      onClose={hidePicker}
      pickerVisible={pickerVisible}
      color={defaultValue}
    />
  );
};

export default compose(
  withState('pickerVisible', 'setPickerVisible', false),
  withHandlers({
    showPicker: ({ setPickerVisible }) => e => setPickerVisible(true),
    hidePicker: ({ setPickerVisible }) => e => setPickerVisible(false)
  }),
  pure
)(ColorPicker);
