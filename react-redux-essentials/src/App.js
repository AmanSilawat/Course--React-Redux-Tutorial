import './App.css';
import ToolkitBasic from './components/toolkit/ToolkitBasic';

import { Counter } from './features/counter/Counter';
import store from './redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

export default App;
