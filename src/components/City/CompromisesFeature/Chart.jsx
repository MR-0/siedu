import React, { Component, createRef } from 'react';
import { select } from 'd3';
import styles from './Compromise.module.scss';

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

export class Chart extends Component {
  holder = createRef();

  draw(element) {
    const rect = element.getBoundingClientRect().toJSON();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const svg = select(element)
      .append('svg')
      .attr("viewBox", [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);
    return [svg, width, height];
  }

  addDataPosition(data, gut, width) {
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

  drawGroups(svg, gut, width) {
    const { data } = this.props;
    const dataPos = this.addDataPosition(data, gut, width);
    return svg
      .selectAll('g.attribute')
      .data(dataPos)
      .join('g')
      .attr('class', 'attribute')
      .attr('transform', d => `translate(${d.pos}, 0)`);
  }

  drawIndicators(groups, width, height) {
    const gut = 2;
    const tooltip = this.props.tooltip || (() => {});
    bodyOver(() => tooltip(null));
    
    return groups
      .selectAll('rect.indicator')
      .data(d => d.values)
      .join('rect')
      .attr('x', (_, i) => i * width)
      .attr('width', width - gut)
      .attr('height', height)
      .attr('class', 'indicator')
      .on('mouseover', tooltip);
  }

  getIndicatorClass(d, intent) {
    let classification;
    if (intent === 'positive') {
      if (d >= 0) classification = 'verybad';
      if (d > 0.5) classification = 'bad';
      if (d > 1) classification = 'good';
      if (d > 2) classification = 'verygood';
    }
    if (intent === 'negative') {
      if (d >= 0) classification = 'verygood';
      if (d > 0.5) classification = 'good';
      if (d > 1) classification = 'bad';
      if (d > 2) classification = 'verybad';
    }
    if (intent === 'boolean') {
      if (d < 0.5) classification = 'verybad';
      if (d >= 0.5) classification = 'verygood';
    }

    return classification;
  }

  updateIndicators() {
    const { data } = this.props;
    const { icon } = styles
    const fills = {
      verybad: '#EF6350', // <-- bad
      bad: '#F5A196',
      good: '#FCDAD5',
      verygood: '#A8C366',
    };
    this.groups.data(data);
    this.indicators
      .data(d => d.values.map(d => {
        const classification = this.getIndicatorClass(d.normalMedian, d.intent);
        return { ...d, classification };
      }));
    this.indicators
      .filter(d => d.normalMedian !== undefined)
      .attr('stroke', 'transparent')
      .attr('fill', d => fills[d.classification]);
    this.indicators
      .filter(d => d.normalMedian === undefined)
      .attr('fill', 'transparent')
      .attr('stroke', '#aaa');
    this.evolution
      .data(d => d.values.map(d => {
        const classification = this.getIndicatorClass(d.normalMedian, d.intent);
        return { ...d, classification };
      }))
      .filter(d => d.normalMedian !== undefined)
      .attr('class', 'evolution-icon ' + icon)
      .attr('fill', '#fff')
      .text(d => {
        const keys = Object.keys(fills);
        const currentInd = keys.indexOf(d.classification);
        const oldClassification = this.getIndicatorClass(d.normalOldMedian, d.intent);
        const oldInd = keys.indexOf(oldClassification);

        if (d.normalOldMedian !== null && d.normalOldMedian !== undefined) {
          if (currentInd > oldInd) return 'a';
          if (currentInd < oldInd) return 'b';
          if (currentInd === oldInd) return 'c';
        }
        return '';
      })
  }

  componentDidMount() {
    const { max, maxGroups } = this.props;
    const [svg, width, height] = this.draw(this.holder.current);
    const gut = 10;
    const partialWidth = (width - maxGroups * gut) / max;
    this.groups = this.drawGroups(svg, gut, partialWidth);
    this.indicators = this.drawIndicators(this.groups, partialWidth, height);
    this.evolution = this.groups
      .selectAll('text')
      .data(d => d.values)
      .join('text')
      .attr('x', (_, i) => (i + 0.5) * partialWidth - 1)
      .attr('y', height * 0.5)
      .attr('dy', '0.4em')
      .style('pointer-events', 'none')
      .text('');
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