import { DataProvider } from 'contexts/Data';
import { ConfigProvider } from 'contexts/Config';
import { ConfigPalette } from './ConfigPalette';
import { City } from './City'

import styles from './App.module.scss';

// TODO:
// - Add tooltip
// - Fix print
// - Cerrar el panel de config al aceptar e imprimir
// - Comprimir modulos de comuna para minimizar espacio vertical

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
