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

import evolutionIconsFont from '../../styles/fonts/evolution-icon.woff';
import { hierarchy, select } from 'd3';

const fetchEvolutionIconsFont = (() => {
  let result;
  
  const fetchResult = async () => {
    const response = await fetch(evolutionIconsFont);
    const blob = await response.blob();
    result = await fileReader(blob);
    return result;
  };

  return async () => {
    return result || await fetchResult(); 
  };
})();

const fileReader = blob => new Promise(resolve => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result);
});

const printSections = async (sections, name) => {
  const sectionsArr = Array.from(sections);
  const iconstFontFileStr = await fetchEvolutionIconsFont();
  const canvasPromises = sectionsArr.map((section) => {
    const holder = document.createElement('div');

    holder.className = 'toprint';
    holder.innerHTML = section.outerHTML;

    document.body.appendChild(holder);

    const svgs = select(holder).selectAll('svg');
    
    svgs.each(function () {
      const { height, width } = this.getBoundingClientRect();
      const svg = select(this)
        .attr('width', width)
        .attr('height', height);
      const style = svg.insert('style', ':first-child')
        .attr('type', 'text/css')
        .text(`@font-face {
          font-family: 'evolution-icon';
          src: url('${iconstFontFileStr}') format('woff');
          font-weight: normal;
          font-style: normal;
        }`);
    });

      return html2canvas(holder, { scale: 2 }).then(canvas => {
        return { canvas, holder } ;
      });
  });
  const canvasResults = await Promise.all(canvasPromises);

  return canvasResults.map(({ canvas, holder }, i) => {
    const n = i + 1;
    const anchor = document.createElement('a');
    anchor.download = name + (n + '').padStart(3, '0');
    anchor.href = canvas.toDataURL();
    anchor.click();
    return canvas;
  });
}

export const ConfigPalette = () => {
  const { year, setConfig } = useConfigValue();
  const [show, setShow] = useState(false);
  const [preConfig, setPreConfig] = useState({});
  const [name, setName] = useState('');
  const handleApplyConfig = e => {
    e.preventDefault();
    setShow(false);
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

    setShow(false);
    printSections(sections, name);
  };

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