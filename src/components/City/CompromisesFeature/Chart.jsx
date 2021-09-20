import React, { Component, createRef, Fragment } from 'react';
import { median, quantile, select } from 'd3';
import { Tooltip } from '../common/Tooltip';
import styles from './Compromise.module.scss';

export class Chart extends Component {
  holder = createRef();
  state = { tooltipData: null };

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
      // old.values = values.map(d => d.old);
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

  handleShowTooltip () {
    return (event, data) => {
      event.stopPropagation();
      this.setState({ tooltipData: data });
    }
  };

  drawIndicators() {
    const gut = 2;
    const width = this.getWidth();
    
    return this.groups
      .selectAll('rect.indicator')
      .data(d => d.values)
      .join('rect')
      .attr('x', (_, i) => i * width)
      .attr('width', width - gut)
      .attr('height', this.height)
      .attr('class', 'indicator')
      .on('mouseover', this.handleShowTooltip());
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
      .filter(d => d.values.filter(d => d.value !== null).length)
      .attr('stroke', 'transparent')
      .attr('fill', d => fills[d.classification]);
    this.indicators
      .filter(d => !d.values.filter(d => d.value !== null).length)
      .attr('fill', 'transparent')
      .attr('stroke', '#aaa');
    this.evolution
      .data(d => d.values)
      .attr('class', 'evolution-icon ' + icon)
      .attr('fill', '#fff')
      .text(d => {
        const current = fillsKeys.indexOf(d.classification);
        const old = fillsKeys.indexOf(d.oldClassification);

        if (old === -1 || current === -1) return '';
        if (current > old) return 'a';
        if (current < old) return 'b';
        if (current === old) return '';
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
    const { tooltipData } = this.state;
    const { standard, values, old, oldClassification, min, max, normalQuantile25, normalQuantile50, normalQuantile75, deviation, intent } = tooltipData || {};
    const medianValue = median(values || [], d => d.value );
    const oldMedianValue = median(old?.values || [], d => d.value );
    return (
      <Fragment>
        <div className={className} ref={this.holder}></div>
        <Tooltip show={ !!tooltipData }>
          <p>{ tooltipData?.indicatorId }</p>
          <p>
            <b>Median: { medianValue }</b>
          </p>
          <p>
            <b>Anterior: { oldMedianValue } / { oldClassification }</b>
          </p>
          <p>
            <b>Min / Max: { min } / { max }</b>
          </p>
          <p>
            <b>Quantiles 25 / 50 / 75 (normalizado): { normalQuantile25 } / { normalQuantile50 } / { normalQuantile75 }</b>
          </p>
          <p>
            <b>Desviación estandard: { deviation }</b>
          </p>
          <p>
            <b>Intent: { intent }</b>
          </p>
          <p>
            <b>Estándar: { standard?.value ?? 'sin estándar' }</b>
          </p>
        </Tooltip>
      </Fragment>
    );
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
  const { values, normalDeviation, normalQuantile25, normalQuantile50, normalQuantile75, standard } = indicator;
  const std = standard?.normal;
  const medianValue = median(values, d => d.normal);

  if (std === undefined) return 'undefined';

  if (std !== null) {
    if (medianValue >= std) return 'zero';
    if (medianValue >= std - normalDeviation * 0.5) return 'low';
    if (medianValue >= std - normalDeviation) return 'medium';
    if (medianValue < std - normalDeviation) return 'high';
  }
  else {
    if (medianValue >= normalQuantile75) return 'zero';
    if (medianValue >= normalQuantile50) return 'low';
    if (medianValue >= normalQuantile25) return 'medium';
    if (medianValue <  normalQuantile25) return 'high';
  }
}