import React from 'react';
import clsx from 'clsx';
import { styles as els } from 'elementary';
import styles from './Legend.module.scss';
import { useConfigValue } from 'contexts/Config';

export const Legend = ({ column, title, hidden }) => {
  const { year } = useConfigValue()
  return (
    <div className={ clsx(els.row, styles.legend) }>
      <div className={ clsx(els.col2, els.textRight) }>
        <h4>{ column }</h4>
      </div>
      <div className={ els.col4 }>
        <h4>{ title } - <b>{ year }</b></h4>
        { !hidden && (
          <div className={ styles.symbols }>
          <table>
            <tbody>
              <tr>
                <th>
                  <span>Relación con el estándar</span>
                </th>
                <td>
                  <i className={ styles.verybad }>&nbsp;</i>
                  <span>Muy lejos de cumplir</span>
                </td>
                <td>
                  <i className={ styles.bad }>&nbsp;</i>
                  <span>Lejos de cumplir</span>
                </td>
                <td>
                  <i className={ styles.mid }>&nbsp;</i>
                  <span>Cerca de cumplir</span>
                </td>
                <td>
                  <i className={ styles.good }>&nbsp;</i>
                  <span>Cumple estándar</span>
                </td>
                <td>
                  <i className={ styles.empty }>&nbsp;</i>
                  <span>Sin datos</span>
                </td>
              </tr>
              <tr>
                <th>
                  <span>Cuartil (sin estándar)</span>
                </th>
                <td>
                  <i className={ styles.verybad }>&nbsp;</i>
                  <span>Primer cuartil</span>
                </td>
                <td>
                  <i className={ styles.bad }>&nbsp;</i>
                  <span>Segundo cuartil</span>
                </td>
                <td>
                  <i className={ styles.mid }>&nbsp;</i>
                  <span>Tercer cuartil</span>
                </td>
                <td>
                  <i className={ styles.good }>&nbsp;</i>
                  <span>Cuarto Cuartil</span>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td colSpan="6">&nbsp;</td>
              </tr>
              <tr>
                <th>
                </th>
                <td>
                  <i className={ styles.grayUp }>&nbsp;</i>
                  <span>Sube una categoría</span>
                </td>
                <td>
                  <i className={ styles.grayDown }>&nbsp;</i>
                  <span>Baja una categoría</span>
                </td>
                <td>
                  <i className={ styles.grayEqual }>&nbsp;</i>
                  <span>Mantiene la categoría</span>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}