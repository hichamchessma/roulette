import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BettingTableComponent } from './components/betting-table/betting-table.component';
import { RouletteWheelComponent } from './components/roulette-wheel/roulette-wheel.component';
import { StrategyButtonsComponent } from './components/strategy-buttons/strategy-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    BettingTableComponent,
    RouletteWheelComponent,
    StrategyButtonsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
