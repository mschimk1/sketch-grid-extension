import PropTypes from 'prop-types';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import setPropTypes from 'recompose/setPropTypes';
import renderComponent from 'recompose/renderComponent';
import SketchGrid from './views/SketchGrid';
import GridOptions from './views/GridOptions';
import Popup from './views/Popup';
import { isPopupView, isOptionsView } from './utils/browser';
import withTheme from './withTheme';

const conditionalRender = routes => compose(...routes.map(r => branch(r.view, renderComponent(r.render))));

const enhance = compose(
  setPropTypes({
    view: PropTypes.string.isRequired
  }),
  conditionalRender([{ view: isPopupView, render: Popup }, { view: isOptionsView, render: GridOptions }])
);

const App = enhance(SketchGrid);

export default withTheme(App);
