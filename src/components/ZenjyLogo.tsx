import React from 'react';

interface ZenjyLogoProps {
  className?: string;
  dark?: boolean;
}

export default function ZenjyLogo({ className = "w-16 h-16", dark = true }: ZenjyLogoProps) {
  // Brand colors based on the image:
  // - Orange: #F15A24 (vibrant orange)
  // - Dark Navy: #152E4E (sleek dark blue)
  // In the dark theme edition of the logo:
  // - Dark Navy color gets replaced by white or rich silver-blue (#E2E8F0 or #F1F5F9 or #60A5FA) to make it pop spectacular against slate-950
  
  const mainBrandColor = dark ? '#FFFFFF' : '#152E4E';
  const secondaryBrandColor = dark ? '#94A3B8' : '#2A4365';
  const accentOrange = '#F15A24';
  
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={`transition-all duration-300 ${className}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="zenjy-motors-logo-group">
        {/* Concentric Circle Frames */}
        {/* Outer Circular Navy/White Arcs */}
        <path 
          d="M 115 155 A 190 190 0 0 1 385 155" 
          stroke={mainBrandColor} 
          strokeWidth="10" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M 90 280 A 190 190 0 0 0 410 280" 
          stroke={mainBrandColor} 
          strokeWidth="10" 
          strokeLinecap="round"
          fill="none"
        />

        {/* Concentric Inner Orange Arcs */}
        <path 
          d="M 135 175 A 160 160 0 0 1 365 175" 
          stroke={accentOrange} 
          strokeWidth="8" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M 120 295 A 155 155 0 0 0 380 295" 
          stroke={accentOrange} 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />

        {/* ========================================================
            SPORTS CAR VECTOR ART (Sleek side profile / front squint)
            ========================================================= */}
        <g id="sports-car" transform="translate(10, 0)">
          {/* Main Car Body Profile */}
          <path 
            d="M 105 210 
               C 115 195, 140 185, 160 180
               C 180 175, 210 155, 235 155
               C 255 155, 285 155, 305 168
               C 320 178, 335 185, 350 188
               C 365 190, 380 195, 385 200
               C 390 205, 395 215, 392 222
               M 110 215
               C 105 218, 102 225, 106 232
               L 115 242 
               C 125 244, 205 244, 290 242
               L 295 220" 
            stroke={mainBrandColor} 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill={dark ? "#0f172a" : "#ffffff"}
          />

          {/* Car Windshield & Side Windows */}
          <path 
            d="M 230 162 
               C 245 162, 265 162, 280 170
               C 290 175, 298 184, 302 192
               L 245 192 Z" 
            fill={secondaryBrandColor}
            opacity="0.35"
          />
          <path 
            d="M 180 183 
               C 195 178, 215 164, 225 162
               L 225 192
               L 182 192
               Z" 
            fill={secondaryBrandColor}
            opacity="0.30"
          />

          {/* Sleek Orange Accent Hood & Side Stripe Decals */}
          <path 
            d="M 235 180 Q 275 180 320 205 Q 350 207 375 212" 
            stroke={accentOrange} 
            strokeWidth="5" 
            strokeLinecap="round"
            fill="none"
          />
          <path 
            d="M 160 212 L 205 212" 
            stroke={accentOrange} 
            strokeWidth="4" 
            strokeLinecap="round"
            fill="none"
          />
          <path 
            d="M 215 224 L 250 224" 
            stroke={accentOrange} 
            strokeWidth="5" 
            strokeLinecap="round"
            fill="none"
          />

          {/* Frontend Grille Shape */}
          <path 
            d="M 108 222 C 108 222, 114 233, 140 234" 
            stroke={mainBrandColor} 
            strokeWidth="5" 
            strokeLinecap="round"
            fill="none"
          />

          {/* Car Wheels with Orange Hub Rims */}
          {/* Wheel 1 (Rear) */}
          <circle cx="160" cy="242" r="23" fill={dark ? "#020617" : "#FFFFFF"} stroke={mainBrandColor} strokeWidth="5" />
          <circle cx="160" cy="242" r="14" fill={accentOrange} />
          <circle cx="160" cy="242" r="6" fill={mainBrandColor} />

          {/* Wheel 2 (Front) */}
          <circle cx="315" cy="242" r="23" fill={dark ? "#020617" : "#FFFFFF"} stroke={mainBrandColor} strokeWidth="5" />
          <circle cx="315" cy="242" r="14" fill={accentOrange} />
          <circle cx="315" cy="242" r="6" fill={mainBrandColor} />
        </g>

        {/* ========================================================
            SPORTS MOTORCYCLE VECTOR ART (Sleek sports bike right overlay)
            ========================================================= */}
        <g id="sports-motorcycle" transform="translate(45, -2)">
          {/* Bike Main Body Frame & Engine Cowling */}
          <path 
            d="M 330 225
               C 310 185, 335 170, 365 170
               C 385 170, 410 155, 415 158
               C 425 162, 430 185, 422 195
               L 395 210
               L 402 225
               Z" 
            fill={dark ? "#1e293b" : "#ffffff"} 
            stroke={mainBrandColor} 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Bike Orange Fairings and Gas Tank Accent */}
          <path 
            d="M 345 185 
               C 355 172, 380 172, 395 182
               C 405 188, 412 180, 415 190
               L 380 205 Z" 
            fill={accentOrange} 
          />
          <path 
            d="M 335 192 L 358 194 L 348 215 Z" 
            fill={accentOrange} 
          />

          {/* Handlebar & Windshield Head details */}
          <circle cx="395" cy="155" r="4.5" fill={accentOrange} />
          <path 
            d="M 390 162 L 405 152" 
            stroke={mainBrandColor} 
            strokeWidth="5" 
            strokeLinecap="round"
          />

          {/* Exhaust Muffler */}
          <path 
            d="M 315 220 L 342 208" 
            stroke={mainBrandColor} 
            strokeWidth="6.5" 
            strokeLinecap="round"
          />
          <circle cx="338" cy="210" r="3.5" fill={accentOrange} />

          {/* Rear Wheel (Left) */}
          <circle cx="308" cy="222" r="21" fill={dark ? "#020617" : "#FFFFFF"} stroke={mainBrandColor} strokeWidth="5.5" />
          <circle cx="308" cy="222" r="12" fill={accentOrange} />
          <circle cx="308" cy="222" r="5" fill={mainBrandColor} />

          {/* Front Wheel & Fender (Right) */}
          <circle cx="418" cy="222" r="21" fill={dark ? "#020617" : "#FFFFFF"} stroke={mainBrandColor} strokeWidth="5.5" />
          <circle cx="418" cy="222" r="12" fill={accentOrange} />
          <circle cx="418" cy="222" r="5" fill={mainBrandColor} />
          
          {/* Fender Guard Arcs */}
          <path 
            d="M 402 198 A 24 24 0 0 1 432 208" 
            stroke={accentOrange} 
            strokeWidth="4" 
            strokeLinecap="round"
            fill="none"
          />
        </g>
        
        {/* ========================================================
            CENTRAL HORIZONTAL GROUND / ESCROW SLASH LINE
            ========================================================= */}
        <path 
          d="M 75 258 L 425 258" 
          stroke={mainBrandColor} 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />

        {/* ========================================================
            ZENJY TEXT - STYLIZED BOLD GOTHIC DECAL
            ========================================================= */}
        {/* We use highly precise clean custom paths for each of the 5 letters of ZENJY */}
        {/* This guarantees the custom, branded slanted font is perfect and uncompromised by OS fonts */}
        
        <g id="letters-zenjy" transform="translate(0, 0)">
          {/* Z: Letter */}
          <path 
            d="M 78 275 H 135 L 85 330 H 135" 
            stroke={mainBrandColor} 
            strokeWidth="11" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
            fill="none"
          />
          
          {/* E: Letter */}
          <path 
            d="M 152 275 H 198 M 152 275 V 330 H 198 M 152 302 H 188" 
            stroke={mainBrandColor} 
            strokeWidth="11" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
            fill="none"
          />
          
          {/* N: Letter */}
          <path 
            d="M 216 330 V 275 L 268 330 V 275" 
            stroke={mainBrandColor} 
            strokeWidth="11" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
            fill="none"
          />
          
          {/* J: Letter */}
          <path 
            d="M 288 275 H 328 M 310 275 V 318 C 310 328, 300 332, 288 332 C 282 332, 276 328, 276 322" 
            stroke={mainBrandColor} 
            strokeWidth="11" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
            fill="none"
          />
          
          {/* Y: Letter */}
          <path 
            d="M 345 275 L 375 304 V 330 M 405 275 L 375 304" 
            stroke={mainBrandColor} 
            strokeWidth="11" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
            fill="none"
          />
        </g>

        {/* ========================================================
            "MOTORS" & "DEALERSHIP" - BOTTOM EMBLEM RIBBON / LABELS
            ========================================================= */}
        {/* Curving decorative brackets */}
        <path 
          d="M 125 352 Q 250 365 375 352" 
          stroke={accentOrange} 
          strokeWidth="4.5" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* MOTORS BANNER TEXT */}
        <text 
          x="250" 
          y="390" 
          fill={accentOrange} 
          fontSize="46" 
          fontWeight="900" 
          fontFamily="'Space Grotesk', 'Outfit', 'Inter', 'Arial Black', sans-serif"
          textAnchor="middle" 
          letterSpacing="4"
          className="font-black tracking-widest"
        >
          MOTORS
        </text>

        {/* DEALERSHIP SUBTEXT */}
        <text 
          x="250" 
          y="421" 
          fill={accentOrange} 
          fontSize="20" 
          fontWeight="800" 
          fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
          textAnchor="middle" 
          letterSpacing="9"
          className="font-extrabold tracking-[0.3em]"
        >
          DEALERSHIP
        </text>

        {/* Framing Base Sweep */}
        <path 
          d="M 180 442 Q 250 458 320 442" 
          stroke={accentOrange} 
          strokeWidth="3.5" 
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
