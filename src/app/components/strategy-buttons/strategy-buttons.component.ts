import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-strategy-buttons',
  templateUrl: './strategy-buttons.component.html',
  styleUrls: ['./strategy-buttons.component.scss']
})
export class StrategyButtonsComponent {
  @Output() strategySelected = new EventEmitter<string>();
  @Output() stopClicked = new EventEmitter<void>();

  selectStrategy(strategy: string): void {
    this.strategySelected.emit(strategy);
  }

  stop(): void {
    this.stopClicked.emit();
  }
}
