import React, { useState } from 'react';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import { YearSelector } from './YearSelector';
import { ZoneSelector } from './ZoneSelector';
import { FileName } from './FileName';
import { useConfigValue } from 'contexts/Config';

import { ReactComponent as ConfigIcon } from './icons/config.svg'
import { ReactComponent as CloseIcon } from './icons/close.svg';

import style from './ConfigPalette.module.scss';
import { styles as els } from 'elementary';

import evolutionIcons from '../../styles/fonts/evolution-icon.woff';
import { select } from 'd3';

export const ConfigPalette = () => {
  const { year, setConfig } = useConfigValue();
  const [show, setShow] = useState(false);
  const [preConfig, setPreConfig] = useState({});
  const [name, setName] = useState('');
  const handleApplyConfig = e => {
    e.preventDefault();
    setConfig(preConfig);
  };
  const handleChangeName = name => setName(name);
  const handleShow = e => {
    e.preventDefault();
    setShow(!show);
  };
  const handlePrinter = e => {
    e.preventDefault();

    const sections = document.querySelectorAll('section');

    Array.from(sections).map((section, i) => {
      const n = i + 1;
      const holder = document.createElement('div');

      holder.className = 'toprint';
      holder.innerHTML = section.outerHTML;

      document.body.appendChild(holder);

      return fetch(evolutionIcons)
        .then(response => response.blob())
        .then(blob => fileReader(blob))
        .then(result => {
          select(holder)
            .selectAll('svg')
            .insert('style', ':first-child')
            .attr('type', 'text/css')
            .text(
              `@font-face {
                font-family: 'evolution-icon';
                src: url('${result}') format('woff');
                font-weight: normal;
                font-style: normal;
              }
              `
            );
        })
        .then(() => {
          window.scrollTo(0, 0);
          return html2canvas(holder, { scale: 2 }).then(canvas => {
            const anchor = document.createElement('a');
            anchor.download = name + (n + '').padStart(3, '0');
            anchor.href = canvas.toDataURL();
            anchor.click();
            document.body.removeChild(holder);
          });
        });
    });

  }

  return (
    <div className={clsx(style.panel, show && style.show)}>
      <a
        href="#open"
        className={style.showButton}
        onClick={handleShow}
      >{show
        ? <CloseIcon />
        : <ConfigIcon />
      }</a>
      <div className={style.scroll}>
        <h3>Configuración</h3>
        <hr />
        <YearSelector onChange={d => setPreConfig({ ...preConfig, ...d })} />
        <br />
        <ZoneSelector onChange={d => setPreConfig({ ...preConfig, ...d })} />
        <br />
        <p className={els.textCenter}>
          <button onClick={handleApplyConfig}>Aceptar</button>
        </p>
        <br />
        <h3>Impresión</h3>
        <hr />
        <FileName year={year} onChange={handleChangeName} />
        <p className={els.textCenter}>
          <button onClick={handlePrinter}>Imprimir</button>
        </p>
      </div>
    </div >
  )
}

const fileReader = blob => new Promise(resolve => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result);
})