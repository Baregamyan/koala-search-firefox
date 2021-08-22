import FocusControl from './components/FocusControl';

const search = document.querySelector('#search');
const searchForm = document.querySelector('#searchform').querySelector('input');
const focusController = new FocusControl(search, searchForm, 'g');

focusController.init();
