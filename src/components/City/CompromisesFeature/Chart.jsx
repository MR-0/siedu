import React, { Component, createRef } from 'react';
import { median, select } from 'd3';
import styles from './Compromise.module.scss';

export class Chart extends Component {
  holder = createRef();

  getData () {
    const { data:dataBase } = this.props;
    const width = this.getWidth();
    const dataPos = addPosition(dataBase, this.gut, width);
    const dataNorm = dataPos.map(group => {
      const values = group.values.map(indicator => {
        const classification = getClassification(indicator);
        const oldClassification = getClassification(indicator.old);
        return { ...indicator, classification, oldClassification };
      });
      return { ...group, values };
    });
    return dataNorm;
  }

  getWidth () {
    const { maxGroups, max } = this.props;
    return (this.width - maxGroups * this.gut) / max;
  }

  drawGroups(data) {
    return this.svg
      .selectAll('g.attribute')
      .data(data)
      .join('g')
      .attr('class', 'attribute')
      .attr('transform', d => `translate(${d.pos}, 0)`);
  }

  drawIndicators() {
    const gut = 2;
    const tooltip = this.props.tooltip || (() => {});
    const width = this.getWidth();
    
    bodyOver(() => tooltip(null));
    
    return this.groups
      .selectAll('rect.indicator')
      .data(d => d.values)
      .join('rect')
      .attr('x', (_, i) => i * width)
      .attr('width', width - gut)
      .attr('height', this.height)
      .attr('class', 'indicator')
      .on('mouseover', tooltip);
  }

  drawEvolution() {
    const width = this.getWidth();
    return this.groups
      .selectAll('text')
      .data(d => d.values)
      .join('text')
      .attr('x', (_, i) => (i + 0.5) * width - 1)
      .attr('y', this.height * 0.5)
      .attr('dy', '0.4em')
      .style('pointer-events', 'none')
      .text('');
  }

  updateIndicators() {
    const data = this.getData();
    const { icon } = styles
    const fills = {
      high: '#EF6350', // <-- bad
      medium: '#F5A196',
      low: '#FCDAD5',
      zero: '#A8C366',
    };
    const fillsKeys = Object.keys(fills);
    this.groups.data(data);
    this.indicators.data(d => d.values);
    this.indicators
      .filter(d => d.values.length)
      .attr('stroke', 'transparent')
      .attr('fill', d => fills[d.classification]);
    this.indicators
      .filter(d => !d.values.length)
      .attr('fill', 'transparent')
      .attr('stroke', '#aaa');
    this.evolution
      .data(d => d.values)
      .attr('class', 'evolution-icon ' + icon)
      .attr('fill', '#fff')
      .text(d => {
        const current = fillsKeys.indexOf(d.classification);
        const old = fillsKeys.indexOf(d.oldClassification);

        if (old === -1) return '';
        if (current > old) return 'a';
        if (current < old) return 'b';
        if (current === old) return 'c';
        return '';
      })
  }

  componentDidMount() {
    this.svg = createSVG(this.holder.current);
    this.width = this.svg.attr('width');
    this.height = this.svg.attr('height');
    this.gut = 10;
    
    const data = this.getData();
    
    this.groups = this.drawGroups(data);
    this.indicators = this.drawIndicators();
    this.evolution = this.drawEvolution();

    this.updateIndicators();
  }

  componentDidUpdate() {
    this.updateIndicators();
  }

  render() {
    const { className } = this.props;
    return <div className={className} ref={this.holder}></div>;
  }
}

const createSVG = (parent) => {
  const rect = parent.getBoundingClientRect().toJSON();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const svg = select(parent)
    .append('svg')
    .attr("viewBox", [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);
  return svg;
}

const addPosition = (data, gut, width) => {
  let prev = null;
  return data.map(d => {
    const out = { ...d };
    out.pos = prev
      ? prev.pos + prev.values.length * width + gut
      : 0;
    prev = out;
    return out;
  });
}

const getClassification = (indicator) => {
  const { values, normalDeviation, standard } = indicator;
  const std = standard.normal;
  // console.log(indicator);
  const medianValue = median(values, d => d.normal);

  if (std !== null) {
    if (medianValue >= std) return 'zero';
    if (medianValue >= std - normalDeviation * 0.5) return 'low';
    if (medianValue >= std - normalDeviation) return 'medium';
    if (medianValue < std - normalDeviation) return 'high';
  }
  else {
    if (medianValue >= 75) return 'zero';
    if (medianValue >= 50) return 'low';
    if (medianValue >= 25) return 'medium';
    if (medianValue <  25) return 'high';
  }
}

const bodyOver = (() => {
  let _callback;
  document.body.addEventListener('mouseover', () => {
    _callback && _callback()
  });
  document.body.addEventListener('scroll', () => {
    _callback && _callback()
  });
  return (callback) => _callback = callback;
})();