import React from 'react';
import { styles as els } from 'elementary';
import { Header } from '../common/Header';
import { Legend } from '../common/Legend';
import { Compromises } from './Compromises';
import { Guide } from './Guide';

import styles from './CompromisesFeature.module.scss';

export const CompromisesFeature = () => {
  const { general } = styles;

  return (
    <section className={general}>
      <Header>
        <p>Con la finalidad de medir y evaluar el grado de cumplimiento de los objetivos, los indicadores se encuentran organizados en base a los 8 compromisos estructurales del SIEDU. Selecciona uno de ellos para conocer más.</p>
      </Header>
      <h3 className={els.hidden}>Resumen compromisos</h3>
      <Legend
        title="Estado general de indicadores"
        column="Compromisos"
      />
      <Compromises />
      <Guide />
    </section>
  )
};