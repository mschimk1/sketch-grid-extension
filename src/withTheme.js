import React from 'react';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#fff'
    }
  },
  typography: {
    useNextVariants: true
  }
});

const styles = () => ({
  '@global': {
    html: {
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      // Change from `box-sizing: content-box` so that `width`
      // is not affected by `padding` or `border`.
      boxSizing: 'border-box'
    },
    body: {
      margin: 0, // Remove the margin in all browsers.
      backgroundColor: theme.palette.background.default
    }
  }
});

const BaseCSS = compose(
  setDisplayName('BaseCSS'),
  withStyles(styles, { name: 'BaseCSS' })
)(() => null);

const withTheme = Component => {
  return props => (
    <MuiThemeProvider theme={theme}>
      <BaseCSS />
      <Component {...props} />
    </MuiThemeProvider>
  );
};

export default withTheme;
