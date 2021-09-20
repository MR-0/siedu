import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { select } from 'd3';
import html2canvas from 'html2canvas';
import { fetchFont } from './utils';
import { useConfigValue } from 'contexts/Config';
import { YearSelector } from './YearSelector';
import { ZoneSelector } from './ZoneSelector';
import { FileName } from './FileName';
import { PrintingModal } from './PrintingModal';

import { ReactComponent as ConfigIcon } from './icons/config.svg'
import { ReactComponent as CloseIcon } from './icons/close.svg';

import evolutionIconsFont from '../../styles/fonts/evolution-icon.woff';
import robotoRegularFont from '../../styles/fonts/Roboto-Regular.woff';
import style from './ConfigPalette.module.scss';
import { styles as els } from 'elementary';

const printSections = async (sections, name) => {
  const sectionsArr = Array.from(sections);
  const iconsFontStr = await fetchFont(evolutionIconsFont);
  const robotFontStr = await fetchFont(robotoRegularFont);
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
        .text(`
          @font-face {
            font-family: 'evolution-icon';
            src: url('${iconsFontStr}') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Roboto';
            src: url('${robotFontStr}') format('woff');
            font-weight: 400;
            font-style: normal;
          }
        `);
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
    document.body.removeChild(holder);
    return canvas;
  });
}

export const ConfigPalette = () => {
  const { year, setConfig } = useConfigValue();
  const [showMenu, setShowMenu] = useState(false);
  const [showPrinting, setShowPrinting] = useState(false);
  const [preConfig, setPreConfig] = useState({});
  const [name, setName] = useState('');
  const handleApplyConfig = e => {
    e.preventDefault();
    setShowMenu(false);
    setConfig(preConfig);
  };
  const handleChangeName = name => setName(name);
  const handleShow = e => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };
  const handlePrinter = e => {
    e.preventDefault();
    const sections = document.querySelectorAll('section');

    setShowMenu(false);
    setShowPrinting(true);
    printSections(sections, name).then(() => {
      setShowPrinting(false);
    });
  };

  if (showPrinting) {
    window.scrollTo(0,0);
    document.body.style.overflow = 'hidden';
  }
  else {
    document.body.style.overflow = 'auto';
  }

  return (
    <Fragment>
      <div className={clsx(style.panel, showMenu && style.show)}>
        <a
          href="#open"
          className={style.showButton}
          onClick={handleShow}
        >{showMenu
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
      </div>
      <PrintingModal visible={ showPrinting } />
    </Fragment>
  )
}