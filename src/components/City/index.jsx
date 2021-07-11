import React, { Fragment } from 'react';
import clsx from 'clsx';
import { useConfigValue } from 'contexts/Config';
import { styles as els } from 'elementary';
import { Header } from './Header';
import { CompromisesFeature } from './CompromisesFeature';
import { CommunesResume } from './CommunesResume'
import { Breachs } from './Breachs';
import { Compromises } from './Compromises';

import styles from './City.module.scss';

// TODO:
// - Quiitar indicador de evolución en 2018 - para todas las instancias
//   donde no hay año anterior
// - Subitulos de misma jerarquia y agregar año
// - Imprimir 2 breachs por sección
// - Agregar iconos pequeõs de evolución en leyenda general
// - Imprimir iconos breachas (bogfix)
// - Revisar caracteres en impresión (bogfix)
// - Section overflow hidden - for production

export const City = () => {
  const { city: cityStyle } = styles;
  const { showCity, city, commune } = useConfigValue();
  const hasCityOrCommune = city || commune;
  const className = clsx(els.container, cityStyle);

  return (
    <div className={className}>
      <Header />
      <main>
        {hasCityOrCommune && (
          <Fragment>
            {showCity && <CompromisesFeature />}
            {showCity && <CommunesResume />}
            {showCity && <Breachs />}
            {!showCity && <Compromises />}
          </Fragment>
        )}
        {!hasCityOrCommune && (
          <div className={clsx(els.containerSm, els.textCenter)}>
            <p>Para comenzar a visualizar los datos</p>
            <h3>Selecciona una ciudad o comuna</h3>
          </div>
        )}
      </main>
    </div>
  )
}