import React from 'react';
import { styles as els } from 'elementary';
import { Header } from '../common/Header';
import { Legend } from '../common/Legend';
import { Communes } from './Communes';

export const CommunesResume = () => {
  return (
    <section className="communes">
      <Header />
      <h3 className={ els.hidden }>Resumen comunas</h3>
      <Legend
        title="Estado general de indicadores por comuna"
      />
      <Communes />
    </section>
  );
}