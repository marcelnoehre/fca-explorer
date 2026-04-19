import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-test',
  standalone: true,
  imports: [],
  templateUrl: './d3-test.html',
  styleUrl: './d3-test.scss',
  encapsulation: ViewEncapsulation.None 
})
export class D3Test implements OnInit {
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef;

  private nodes = [
    { id: '111', x: 0,  y: 3 }, 
    { id: '110', x: -1, y: 2 }, { id: '101', x: 0, y: 2 }, { id: '011', x: 1, y: 2 },
    { id: '100', x: -1, y: 1 }, { id: '010', x: 0, y: 1 }, { id: '001', x: 1, y: 1 },
    { id: '000', x: 0,  y: 0 }  
  ];

  private links = [
    { s: '111', t: '110' }, { s: '111', t: '101' }, { s: '111', t: '011' },
    { s: '110', t: '100' }, { s: '110', t: '010' },
    { s: '101', t: '100' }, { s: '101', t: '001' },
    { s: '011', t: '010' }, { s: '011', t: '001' },
    { s: '100', t: '000' }, { s: '010', t: '000' }, { s: '001', t: '000' }
  ];

  ngOnInit() {
    const width = 600;
    const height = 500;
    const padding = 60;

    const scaleX = (x: number) => (width / 2) + (x * 120);
    const scaleY = (y: number) => (height - padding) - (y * 120);

    const svg = d3.select(this.canvas.nativeElement)
                  .attr('viewBox', `0 0 ${width} ${height}`);

    // edges
    svg.append('g')
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('class', 'link-line')
      .attr('x1', d => scaleX(this.findNode(d.s).x))
      .attr('y1', d => scaleY(this.findNode(d.s).y))
      .attr('x2', d => scaleX(this.findNode(d.t).x))
      .attr('y2', d => scaleY(this.findNode(d.t).y))
      .attr('stroke', '#444')
      .attr('stroke-width', 2);

    // nodes
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(this.nodes)
      .join('g')
      .attr('transform', d => `translate(${scaleX(d.x)}, ${scaleY(d.y)})`);

    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('class', 'node-circle');

    nodeGroups.append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .text(d => d.id);
  }

  private findNode(id: string) {
    const node = this.nodes.find(n => n.id === id);
    if (!node) throw new Error(`Node ${id} not found`);
    return node;
  }
}