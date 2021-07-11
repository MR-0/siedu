import { DataProvider } from 'contexts/Data';
import { ConfigProvider } from 'contexts/Config';
import { ConfigPalette } from './ConfigPalette';
import { City } from './City'

import styles from './App.module.scss';

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
      <p>v.1.1.0</p>
    </div>
  );
};

export default App;
