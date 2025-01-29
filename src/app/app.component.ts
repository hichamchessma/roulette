import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentBet: any = null;
  balance = 1000; // Solde initial
  betAmount = 10; // Mise par défaut

  onBetPlaced(bet: any) {
    this.currentBet = bet;
  }

  onSpinComplete(winningNumber: number) {
    if (!this.currentBet) return;

    // Vérifier si le pari est gagnant
    let won = false;
    let multiplier = 0;

    if (typeof this.currentBet.value === 'number') {
      // Pari sur un numéro spécifique
      if (this.currentBet.value === winningNumber) {
        won = true;
        multiplier = 35;
      }
    } else {
      // Pari sur des options
      switch(this.currentBet.value) {
        case 'red':
          won = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber);
          multiplier = 1;
          break;
        case 'black':
          won = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].includes(winningNumber);
          multiplier = 1;
          break;
        case 'even':
          won = winningNumber % 2 === 0 && winningNumber !== 0;
          multiplier = 1;
          break;
        case 'odd':
          won = winningNumber % 2 === 1;
          multiplier = 1;
          break;
        case '1-18':
          won = winningNumber >= 1 && winningNumber <= 18;
          multiplier = 1;
          break;
        case '19-36':
          won = winningNumber >= 19 && winningNumber <= 36;
          multiplier = 1;
          break;
        case '1-12':
          won = winningNumber >= 1 && winningNumber <= 12;
          multiplier = 2;
          break;
        case '13-24':
          won = winningNumber >= 13 && winningNumber <= 24;
          multiplier = 2;
          break;
        case '25-36':
          won = winningNumber >= 25 && winningNumber <= 36;
          multiplier = 2;
          break;
      }
    }

    if (won) {
      this.balance += this.betAmount * (multiplier + 1);
    } else {
      this.balance -= this.betAmount;
    }

    this.currentBet = null;
  }
}
