import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isRed(num: number): boolean {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
  }
  winningNumber: number | null = null;
  currentBet: any = null;
  balance = 1000; // Solde initial
  betAmount = 10; // Mise par défaut
  numbers: number[] = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  onBetPlaced(bet: any) {
    this.currentBet = bet;
  }

  onSpinComplete(winningNumber: number) {
    this.winningNumber = winningNumber;
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
          won = this.isRed(winningNumber);
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
