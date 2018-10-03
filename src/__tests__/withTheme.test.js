import React from 'react';
import { render, cleanup } from 'react-testing-library';
import withTheme from '../withTheme';
import { withStyles } from '@material-ui/core/styles';

afterEach(cleanup);

test('wraps component in theme', () => {
  const styles = theme => ({
    root: {
      color: theme.palette.primary.light
    }
  });
  const Component = ({ classes }) => <div data-testid="root" className={classes.root} />;
  const StyledComponent = withTheme(withStyles(styles)(Component));
  const { getByTestId } = render(<StyledComponent />);

  const elem = getByTestId('root');
  expect(elem.classList[0]).toBe('Component-root-1');
});
