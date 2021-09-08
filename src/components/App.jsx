import { DataProvider } from 'contexts/Data';
import { ConfigProvider } from 'contexts/Config';
import { ConfigPalette } from './ConfigPalette';
import { City } from './City'

import styles from './App.module.scss';

// TODO:
// - Fix print
// - Add tooltip

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
