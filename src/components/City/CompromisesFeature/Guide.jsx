import React, { Component, createRef } from 'react';
import { groups, max, select } from 'd3';
import { useDataValue } from 'contexts/Data';
import { styles as els } from 'elementary';

export const Guide = () => {
  const {compromises} = useDataValue();
  const attributeGropued = compromises.map(compromise => {
    const attributes = groups(compromise.indicators, d => d.attribute)
      .map(([name, indicators]) => ({name, indicators}));
    return { ...compromise, attributes };
  });

  return (
    <div className={els.row}>
      <div className={els.col2}></div>
      <div className={els.col4}>
        <div className={els.mar}></div>
        <p className={els.marXs} style={{
          opacity: 0.6
        }}>
          <span className={els.textSm}>Guía de atributos</span>
        </p>
        <Chart data={attributeGropued} />
      </div>
    </div>
  );
};

class Chart extends Component {
  svgRef = createRef();
  block = 15;
  wfac = 1.3;

  transformData() {
    const {data} = this.props;
    data.forEach((compromise, i) => {
      let prev = 0;
      compromise.attributes = compromise.attributes.map((d,ii) => {
        const row = i + 1;
        const letter = String.fromCharCode(97 + ii);
        const left = prev;
        const width = d.indicators.length * this.block * this.wfac;
        prev = prev + width;
        return {...d, left, width, row, letter};
      });
    });
  }
  
  draw() {
    const {data} = this.props;  
    this.svg = select(this.svgRef.current);
    this.rows = this.svg
      .selectAll('g.row')
      .data(data)
      .join('g')
      .attr('class', 'row');
    this.cols = this.rows
      .selectAll('g.col')
      .data(d => d.attributes)
      .join('g')
      .attr('class', 'col');
    this.rects = this.cols
      .append('rect')
      .attr('fill', 'transparent')
      .attr('stroke', '#aaa');
    this.texts = this.cols
      .append('text')
      .attr('font-size', '9px')
      .attr('fill', '#333')
      .attr('y', this.block - 3)
      .attr('x', 2)
  }

  update() {
    const {data} = this.props;
    const maxValue = max(data, d => d.indicators.length);
    const height = data.length * this.block;
    const width = maxValue * this.block * this.wfac;
    this.svg
      .attr("viewBox", [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);
    this.rows
      .data(data)
      .attr('transform', (d,i) => `translate(0,${ i * this.block })`);
    this.cols
      .data(d => d.attributes)
      .attr('transform', (d) => {
        return `translate(${ d.left }, 0)`
      });
    this.rects
      .attr('height', this.block)
      .attr('width', d => d.width);
    this.texts
      .text(d => d.row+d.letter);
      
  }

  componentDidMount() {
    this.transformData();
    this.draw();
    this.update();
  }

  componentDidUpdate() {
    this.transformData();
    this.update();
  }
  
  render () {
    return <svg ref={this.svgRef}></svg>;
  }
}