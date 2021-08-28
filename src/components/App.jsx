import { DataProvider } from 'contexts/Data';
import { ConfigProvider } from 'contexts/Config';
import { ConfigPalette } from './ConfigPalette';
import { City } from './City'

import styles from './App.module.scss';

// TODO:
// - handle units: % - percentage, m - metters, ha - hectareas
// - Add config and close icon to config pallette
// - Add tooltip
// - Fix print

export const App = () => {
  const { app } = styles;
  return (
    <div className={ app }>
      <ConfigProvider>
        <DataProvider>
          <ConfigPalette />
          <City />
        </DataProvider>
      </ConfigProvider>
    </div>
  );
};

export default App;
