import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-betting-table',
  templateUrl: './betting-table.component.html',
  styleUrls: ['./betting-table.component.scss']
})
export class BettingTableComponent implements OnInit {
  @Output() betPlaced = new EventEmitter<any>();
  
  numbers: number[] = [];
  redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  
  ngOnInit() {
    this.numbers = Array.from({ length: 36 }, (_, i) => i + 1);
  }

  getNumberClass(number: number): string {
    if (this.redNumbers.includes(number)) {
      return 'red';
    }
    return 'black';
  }

  placeBet(bet: number | string) {
    this.betPlaced.emit({ type: typeof bet === 'number' ? 'number' : 'option', value: bet });
  }
}
