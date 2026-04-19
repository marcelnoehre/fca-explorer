import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cxt',
  imports: [CommonModule, FormsModule],
  templateUrl: './cxt.html',
  styleUrl: './cxt.scss',
})
export class Cxt {
  columns: string[] = ['m1', 'm2', 'm3', 'm4'];
  rows: string[] = ['g1', 'g2', 'g3'];
  cells: boolean[][] = this.buildGrid(3, 4);

  editingCol: number | null = null;
  editingRow: number | null = null;

  editingValue: string = '';

  isDirty = false;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) { }

  private buildGrid(rows: number, cols: number): boolean[][] {
    return Array.from({ length: rows }, () => Array(cols).fill(false));
  }

  toggleCell(r: number, c: number): void {
    this.cells[r][c] = !this.cells[r][c];
    this.isDirty = true;
  }

  addColumn(): void {
    this.columns.push(`m${this.columns.length + 1}`);
    this.cells.forEach(row => row.push(false));
    this.isDirty = true;
  }

  removeColumn(c: number): void {
    if (this.columns.length <= 1) return;
    this.columns.splice(c, 1);
    this.cells.forEach(row => row.splice(c, 1));
    this.isDirty = true;
  }

  addRow(): void {
    this.rows.push(`g${this.rows.length + 1}`);
    this.cells.push(Array(this.columns.length).fill(false));
    this.isDirty = true;
  }

  removeRow(r: number): void {
    if (this.rows.length <= 1) return;
    this.rows.splice(r, 1);
    this.cells.splice(r, 1);
    this.isDirty = true;
  }

  startEditCol(index: number): void {
    this.editingCol = index;
    this.editingValue = this.columns[index];
  }

  startEditRow(index: number): void {
    this.editingRow = index;
    this.editingValue = this.rows[index];
  }

  stopEdit(): void {
    if (this.editingCol !== null) this.columns[this.editingCol] = this.editingValue;
    if (this.editingRow !== null) this.rows[this.editingRow] = this.editingValue;
    this.editingCol = null;
    this.editingRow = null;
    this.isDirty = true;
  }

  isDragging = false;
  fileName: string | null = null;
  parseError: string | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.handleFile(files[0]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.handleFile(input.files[0]);
  }

  private handleFile(file: File): void {
    this.parseError = null;

    if (!file.name.endsWith('.cxt')) {
      this.parseError = 'Invalid file type — please upload a .cxt file.';
      return;
    }

    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.zone.run(() => this.parseCxt(text));
    };
    reader.readAsText(file);
  }

  private parseCxt(raw: string): void {
    const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    let i = 0;

    const next = (): string => (i < lines.length ? lines[i++].trim() : '');

    const magic = next();
    if (magic !== 'B') {
      this.parseError = `Not a valid Burmeister .cxt file (expected "B", got "${magic}").`;
      return;
    }

    next();

    const objCount = parseInt(next(), 10);
    const attrCount = parseInt(next(), 10);

    next();

    if (isNaN(objCount) || isNaN(attrCount)) {
      this.parseError = 'Could not parse object/attribute counts.';
      return;
    }

    const newRows: string[] = [];
    for (let r = 0; r < objCount; r++) newRows.push(next() || `g${r + 1}`);

    const newCols: string[] = [];
    for (let c = 0; c < attrCount; c++) newCols.push(next() || `m${c + 1}`);

    const newCells: boolean[][] = [];
    for (let r = 0; r < objCount; r++) {
      const rowStr = next();
      newCells.push(
        Array.from({ length: attrCount }, (_, c) => rowStr[c]?.toLowerCase() === 'x')
      );
    }

    this.rows = [...newRows];
    this.columns = [...newCols];
    this.cells = newCells.map(row => [...row]);
    this.cdr.markForCheck();

  }


}