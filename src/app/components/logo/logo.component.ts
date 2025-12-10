import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spotl-logo" [style.width.px]="size" [style.height.px]="size">
      <svg
        [attr.width]="size"
        [attr.height]="size"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Abstract Friendly Logo: Connecting Nodes/Smile -->
        <circle
          cx="16"
          cy="16"
          r="14"
          [attr.fill]="'url(#paint0_linear_' + uniqueId + ')'"
          fill-opacity="0.1"
        />
        <path
          d="M10 16C10 16 12 21 16 21C20 21 22 16 22 16"
          [attr.stroke]="'url(#paint1_linear_' + uniqueId + ')'"
          stroke-width="3"
          stroke-linecap="round"
        />
        <circle cx="10" cy="14" r="2.5" fill="#F09433" />
        <circle cx="22" cy="14" r="2.5" fill="#BC1888" />
        <defs>
          <linearGradient
            [attr.id]="'paint0_linear_' + uniqueId"
            x1="2"
            y1="2"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F09433" />
            <stop offset="1" stop-color="#BC1888" />
          </linearGradient>
          <linearGradient
            [attr.id]="'paint1_linear_' + uniqueId"
            x1="10"
            y1="16"
            x2="22"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F09433" />
            <stop offset="1" stop-color="#BC1888" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  `,
  styles: [
    `
      .spotl-logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class LogoComponent {
  @Input() size: number = 32;
  uniqueId: string = Math.random().toString(36).substring(2, 9);
}
