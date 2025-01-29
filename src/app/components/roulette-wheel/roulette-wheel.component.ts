import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-roulette-wheel',
  templateUrl: './roulette-wheel.component.html',
  styleUrls: ['./roulette-wheel.component.scss']
})
export class RouletteWheelComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() spinComplete = new EventEmitter<number>();

  private ctx!: CanvasRenderingContext2D;
  private radius = 200;
  private numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  private ballRadius = 8;
  private ballAngle = 0;
  private ballSpeed = 0;
  private wheelAngle = 0;
  private isSpinning = false;
  selectedNumber: number | null = null;

  ngAfterViewInit() {
    this.initCanvas();
    this.drawWheel();
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 2 * this.radius + 40;
    canvas.height = 2 * this.radius + 40;
    this.ctx = canvas.getContext('2d')!;
  }

  spinWheel() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.ballSpeed = Math.random() * 0.3 + 0.7; // Random initial speed
    this.selectedNumber = null;
    
    const animate = () => {
      if (!this.isSpinning) return;

      // Update ball position
      this.ballAngle += this.ballSpeed;
      this.wheelAngle += 0.01;
      this.ballSpeed *= 0.995; // Gradually slow down

      // Clear and redraw
      this.drawWheel();
      this.drawBall();

      // Check if ball has slowed enough to stop
      if (this.ballSpeed > 0.01) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.selectWinningNumber();
      }
    };

    animate();
  }

  private drawWheel() {
    const ctx = this.ctx;
    const centerX = this.radius + 20;
    const centerY = this.radius + 20;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pockets
    const pocketAngle = (2 * Math.PI) / this.numbers.length;
    for (let i = 0; i < this.numbers.length; i++) {
      const angle = i * pocketAngle + this.wheelAngle;
      const number = this.numbers[i];
      
      // Draw pocket
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, this.radius, angle, angle + pocketAngle);
      ctx.closePath();
      
      // Set color based on number
      if (number === 0) {
        ctx.fillStyle = '#008000'; // Green for 0
      } else if (number % 2 === 0) {
        ctx.fillStyle = '#FF0000'; // Red for even numbers
      } else {
        ctx.fillStyle = '#000000'; // Black for odd numbers
      }
      
      ctx.fill();
      ctx.stroke();

      // Draw numbers
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + pocketAngle / 2);
      ctx.translate(this.radius * 0.75, 0);
      ctx.rotate(-angle - pocketAngle / 2);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(number.toString(), 0, 0);
      
      ctx.restore();
    }
  }

  private drawBall() {
    const centerX = this.radius + 20;
    const centerY = this.radius + 20;
    const ballDistance = this.radius * 0.85;
    const x = centerX + ballDistance * Math.cos(this.ballAngle);
    const y = centerY + ballDistance * Math.sin(this.ballAngle);

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.ballRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private selectWinningNumber() {
    const normalizedAngle = (this.ballAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const pocketAngle = (2 * Math.PI) / this.numbers.length;
    const index = Math.floor(normalizedAngle / pocketAngle);
    this.selectedNumber = this.numbers[index];
    this.spinComplete.emit(this.selectedNumber);
  }
}
