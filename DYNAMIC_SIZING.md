# Dynamic Card Sizing System

## Overview
The Memory Card Game now features an intelligent dynamic sizing system that automatically adjusts card sizes based on window dimensions and grid density, ensuring optimal gameplay experience across all devices and difficulty levels.

## How It Works

### Responsive Sizing Algorithm
The `useCardSize` hook calculates optimal card dimensions using:

1. **Available Space Calculation**
   - Window width/height minus UI elements (headers, padding, etc.)
   - Grid gaps and spacing requirements
   - Maintains 4:5 aspect ratio for all cards

2. **Size Constraints by Device**
   - **Mobile** (< 640px): 48px - 80px width
   - **Tablet** (640px - 1024px): 64px - 96px width  
   - **Desktop** (> 1024px): 80px - 120px width

3. **Grid Density Adaptation**
   - Automatically reduces card size for higher difficulties
   - Adjusts gaps between cards based on card size
   - Ensures all cards fit comfortably on screen

### Dynamic Features

#### Card Sizing
- Cards automatically scale from 48px to 144px width
- Height maintains 4:5 aspect ratio
- Rounded to Tailwind-compatible units (multiples of 4px)

#### Gap Management
- **Large cards** (>96px): 16px gaps (`gap-4`)
- **Medium cards** (>80px): 12px gaps (`gap-3`) 
- **Small cards** (≤80px): 8px gaps (`gap-2`)

#### Icon Scaling
- Question mark icons scale with card size
- Ranges from `text-lg` to `text-4xl`
- Maintains visual balance at all sizes

## Technical Implementation

### Key Components

#### `useCardSize` Hook
```typescript
const cardSize = useCardSize(currentDifficulty);
// Returns: { width: number, height: number, className: string }
```

#### Dynamic Grid Classes
- Supports 4-7 column layouts
- Responsive gap sizing
- Auto-centering with `max-w-fit`

#### Card Component Enhancement
- Accepts `sizeClass` prop for dynamic sizing
- Responsive icon sizing based on card dimensions
- Maintains consistent visual hierarchy

### Difficulty-Specific Behavior

| Difficulty | Cards | Grid | Typical Size (Desktop) | Typical Size (Mobile) |
|------------|-------|------|------------------------|----------------------|
| Beginner   | 12    | 4×3  | 120px × 150px         | 80px × 100px        |
| Easy       | 16    | 4×4  | 96px × 120px          | 72px × 90px         |
| Medium     | 20    | 5×4  | 88px × 110px          | 64px × 80px         |
| Hard       | 24    | 6×4  | 80px × 100px          | 56px × 70px         |
| Expert     | 28    | 7×4  | 72px × 90px           | 48px × 60px         |

## Benefits

1. **Optimal Screen Usage**
   - Large screens utilize available space effectively
   - Small screens maintain playability without scrolling

2. **Consistent Experience**
   - All difficulty levels remain playable on all devices
   - Visual hierarchy preserved across screen sizes

3. **Performance Optimized**
   - Efficient resize handling with debouncing
   - Minimal re-renders during window resize

4. **Accessibility Enhanced**
   - Larger touch targets on larger screens
   - Readable icons at all sizes
   - Comfortable spacing for all input methods

## Future Enhancements

- **Orientation Detection**: Different sizing for portrait/landscape
- **User Preferences**: Manual size override options
- **Animation Scaling**: Smooth transitions during resize
- **Density Options**: User-selectable card density settings

This system ensures the Memory Card Game provides an optimal experience regardless of device size or difficulty level chosen.
