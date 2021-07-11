import React, { Component, createRef } from 'react';
import { groups, select, sum } from 'd3';
import clsx from 'clsx';
import { useDataValue } from 'contexts/Data';
import { styles as els } from 'elementary';
import styles from './Communes.module.scss';

export const Communes = () => {
  const { communes } = useDataValue();
  const { row, col2, col4, gutNo, middle } = els;
  const sortedCommunes = communes.localValues.sort((a,b) => {
    return a.name > b.name
      ? 1
      : a.name < b.name
        ? -1
        : 0;
  })
  return sortedCommunes.map((commune, i) => {
    return (
      <div key={i} className={ clsx(row, middle, styles.communes) }>
        <div className={ clsx(col2, gutNo) }>
            <h5>{ commune.name }</h5>
        </div>
        <div className={ col4 }>
          <Chart className={ styles.stack } data={ commune.values } />
        </div>
      </div> 
    )
  });
};

const fills = {
  verybad: '#EF6350',
  bad: '#F5A196',
  good: '#FCDAD5',
  verygood: '#A8C366',
  undefined: 'transparent'
};

class Chart extends Component {
  holder = createRef();

  selectSvg (element) {
    const rect = element.getBoundingClientRect().toJSON();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height) || 20;
    const svg = select(element)
      .attr("viewBox", [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);
    return { svg, width, height };
  }

  addDataPosition (data, gut, width) {
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

  drawGroups (svg, gut, width) {
    const { data } = this.props;
    const dataPos = this.addDataPosition(data, gut, width);
    return svg
      .selectAll('g.attribute')
      .data(dataPos)
      .join('g')
      .attr('class', 'attribute')
      .attr('transform', d => `translate(${ d.pos }, 0)`);
  }

  drawIndicators (groups, width, height) {
    const gut = 2;
    return groups
      .selectAll('rect.indicator')
      .data(d => d.values)
      .join('rect')
      .attr('x', (_, i) => i * width)
      .attr('width', width - gut)
      .attr('height', height)
      .attr('class', 'indicator');
  }

  groupStack = (data, fills, w, fun) => {
    const min = 20;
    const stack = groups(data, d => {
      const value = fun(d);
      if (value || value === 0) {
        if (value > 2) return 'verygood';
        if (value > 1) return 'good';
        if (value > 0.5) return 'bad';
        if (value >= 0) return 'verybad';
      }
      return 'undefined';
    }).map(d => ({ name: d[0], values: d[1] }));
    const width = w - (min * stack.length);
    const total = sum(stack, d => d.values.length);
    return (() => {
      let prev = 0;
      return Object.keys(fills)
        .map(key => stack.find(d => d.name === key))
        .filter(d => d)
        .map((d, i) => {
          const x = (prev * width / total) + (min * i);
          const w = (d.values.length * width / total) + min;
          prev += d.values.length;
          return { ...d, x, width: w };
        })
    })();
  }

  drawStackBars () {
    const { svg, width, height } = this.selectSvg(this.holder.current);
    const { data } = this.props;
    const stack = this.groupStack(data, fills, width, d => d.intentded );
    const g = svg.append('g').attr('class','bar');
    this.rects = g.selectAll('rect')
      .data(stack)
      .join('rect')
      .attr('height', height);
    this.texts = g.selectAll('text')
      .data(stack)
      .join('text')
      .attr('y', height * 0.5)
      .attr('dy', '0.5em')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle');
  }

  updateStackBars () {
    const { data } = this.props;
    const { width } = this.selectSvg(this.holder.current);
    const stack = this.groupStack(data, fills, width, d => d.intentded);
    const oldStack = this.groupStack(data, fills, width, d => (
      d.old?.intentded
    ));
    stack.map((d, i) => d.old = oldStack[i]);
    this.rects
      .data(stack)
      .attr('x', d => d.x)
      .attr('width', d => d.width)
      .attr('fill', d => fills[d.name])
      .attr('stroke', d => d.name === 'undefined' ? '#888' : '');
    this.texts
      .data(stack)
      .attr('x', d => d.x + d.width - 10)
      .attr('class', 'evolution-icon')
      .text(d => {
        if (!d.values || !d.old?.values) return '';
        return d.values.length === d.old.values.length
          ? 'c'
          : d.values.length > d.old.values.length
          ? 'a'
          : 'b'
      })
  }

  componentDidMount () {
    this.drawStackBars();
    this.updateStackBars();
  }

  componentDidUpdate () {
    this.updateStackBars();
  }
  
  render () {
    const { className } = this.props;
    return (
      <div className={ className }>
        <svg ref={ this.holder }></svg>
      </div>
    );
  }
}