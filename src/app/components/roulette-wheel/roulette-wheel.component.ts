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
  private radius = 250; // Increased radius for better detail
  private numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  private ballRadius = 6;
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

    // Draw background
    ctx.fillStyle = '#004400';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw outer rim (golden)
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
    const gradient = ctx.createLinearGradient(0, centerY - this.radius, 0, centerY + this.radius);
    gradient.addColorStop(0, '#DAA520');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#DAA520');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw inner wheel (dark brown)
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = '#3D2B1F';
    ctx.fill();

    // Draw pockets
    const pocketAngle = (2 * Math.PI) / this.numbers.length;
    for (let i = 0; i < this.numbers.length; i++) {
      const angle = i * pocketAngle + this.wheelAngle;
      const number = this.numbers[i];
      
      // Draw pocket
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, this.radius * 0.95, angle, angle + pocketAngle);
      ctx.closePath();
      
      // Set color based on number with gradient for depth
      let gradientPocket;
      if (number === 0) {
        gradientPocket = ctx.createRadialGradient(
          centerX, centerY, this.radius * 0.4,
          centerX, centerY, this.radius * 0.95
        );
        gradientPocket.addColorStop(0, '#006400');
        gradientPocket.addColorStop(1, '#004d00');
      } else if (number % 2 === 0) {
        gradientPocket = ctx.createRadialGradient(
          centerX, centerY, this.radius * 0.4,
          centerX, centerY, this.radius * 0.95
        );
        gradientPocket.addColorStop(0, '#cc0000');
        gradientPocket.addColorStop(1, '#990000');
      } else {
        gradientPocket = ctx.createRadialGradient(
          centerX, centerY, this.radius * 0.4,
          centerX, centerY, this.radius * 0.95
        );
        gradientPocket.addColorStop(0, '#1a1a1a');
        gradientPocket.addColorStop(1, '#000000');
      }
      
      ctx.fillStyle = gradientPocket;
      ctx.fill();
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw numbers with shadow
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + pocketAngle / 2);
      ctx.translate(this.radius * 0.88, 0);
      ctx.rotate(-angle - pocketAngle / 2);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(number.toString(), 0, 0);
      
      ctx.restore();
    }

    // Draw central hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius * 0.15, 0, 2 * Math.PI);
    const hubGradient = ctx.createRadialGradient(
      centerX - 5, centerY - 5, 0,
      centerX, centerY, this.radius * 0.15
    );
    hubGradient.addColorStop(0, '#DAA520');
    hubGradient.addColorStop(1, '#B8860B');
    ctx.fillStyle = hubGradient;
    ctx.fill();
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw spinning mechanism (horizontal bar)
    ctx.beginPath();
    ctx.moveTo(centerX - this.radius * 0.3, centerY);
    ctx.lineTo(centerX + this.radius * 0.3, centerY);
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw spheres at the ends of the bar
    const sphereRadius = 10;
    const sphereGradient = ctx.createRadialGradient(
      centerX - this.radius * 0.3 - 2, centerY - 2, 0,
      centerX - this.radius * 0.3, centerY, sphereRadius
    );
    sphereGradient.addColorStop(0, '#FFD700');
    sphereGradient.addColorStop(1, '#DAA520');

    // Left sphere
    ctx.beginPath();
    ctx.arc(centerX - this.radius * 0.3, centerY, sphereRadius, 0, 2 * Math.PI);
    ctx.fillStyle = sphereGradient;
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right sphere
    ctx.beginPath();
    ctx.arc(centerX + this.radius * 0.3, centerY, sphereRadius, 0, 2 * Math.PI);
    ctx.fillStyle = sphereGradient;
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawBall() {
    const centerX = this.radius + 20;
    const centerY = this.radius + 20;
    const ballDistance = this.radius * 0.85;
    const x = centerX + ballDistance * Math.cos(this.ballAngle);
    const y = centerY + ballDistance * Math.sin(this.ballAngle) ;

    // Draw ball shadow
    this.ctx.beginPath();
    this.ctx.arc(x + 2, y + 2, this.ballRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fill();

    // Draw ball with gradient for 3D effect
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.ballRadius, 0, 2 * Math.PI);
    const ballGradient = this.ctx.createRadialGradient(
      x - 2, y - 2, 0,
      x, y, this.ballRadius
    );
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(1, '#E0E0E0');
    this.ctx.fillStyle = ballGradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#CCCCCC';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Add highlight
    this.ctx.beginPath();
    this.ctx.arc(x - 2, y - 2, this.ballRadius * 0.3, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fill();
  }

  private selectWinningNumber() {
    const normalizedAngle = (this.ballAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const pocketAngle = (2 * Math.PI) / this.numbers.length;
    const index = Math.floor(normalizedAngle / pocketAngle);
    this.selectedNumber = this.numbers[index];
    this.spinComplete.emit(this.selectedNumber);
  }
}
