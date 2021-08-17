import React, { Component, createRef } from 'react';
import { groups, select, sum } from 'd3';

const fills = {
  high: '#EF6350',
  medium: '#F5A196',
  low: '#FCDAD5',
  zero: '#A8C366',
  undefined: 'transparent'
};

export class Chart extends Component {
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

  drawStackBars () {
    const { svg, width, height } = this.selectSvg(this.holder.current);
    const { data } = this.props;
    const stack = groupStack(data, width);
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
    const stack = groupStack(data, width);
    const oldStack = groupStack(data, width);
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
        if (d.old?.name === 'undefined') return '';
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

const groupStack = (data, w) => {
  const min = 20;
  const order = ['high', 'medium', 'low', 'zero', 'undefined'];
  const stack = groups(data, d => d.classification)
    .map(([name, values]) => ({ name, values }))
    .sort((a, b) => {
      const i = order.indexOf(a.name);
      const ii = order.indexOf(b.name);
      return i === ii
        ? 0
        : i > ii
        ? 1
        : -1 
    });
  const width = w - (min * stack.length);
  const total = sum(stack, d => d.values.length);
  let prev = 0;
  return stack.map((d, i) => {
    const x = (prev * width / total) + (min * i);
    const w = (d.values.length * width / total) + min;
    prev += d.values.length;
    return { ...d, x, width: w };
  });
}