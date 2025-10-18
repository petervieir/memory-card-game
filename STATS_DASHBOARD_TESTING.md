# Personal Statistics Dashboard - Testing Guide

## Quick Start

1. **Start Development Server**:
   ```bash
   cd front-end
   npm run dev
   ```
   Open http://localhost:3000

2. **Connect Wallet**: Click "Connect Wallet" button

3. **Navigate to Stats**: 
   - Click the "📊 Personal Statistics" card on the home page, OR
   - Click "📊 Statistics" link in the game page header

## Testing Checklist

### ✅ Basic Functionality
- [ ] Stats page loads without errors
- [ ] Empty state shows for new players
- [ ] "Play Now" button works from stats page
- [ ] Navigation links work (Home, Game, Achievements)

### ✅ Game Recording
- [ ] Play a game and complete it
- [ ] Verify game appears in "Recent Games" table
- [ ] Check that statistics update (Total Games increases)
- [ ] Play multiple games and verify all are recorded

### ✅ Statistics Accuracy
- [ ] **Win Rate**: Play games and verify percentage is correct
- [ ] **Total Points**: Matches points earned from games
- [ ] **Average Moves**: Reflects actual average from games
- [ ] **Best Scores**: Shows highest score achieved per difficulty
- [ ] **Best Moves**: Shows lowest move count per difficulty

### ✅ Difficulty-Specific Stats
- [ ] Play games on different difficulties
- [ ] Verify each difficulty shows separate statistics
- [ ] Check win rate per difficulty is calculated correctly
- [ ] Verify "games played" count is accurate for each

### ✅ Move Efficiency Graph
- [ ] Play at least 5 games to see graph
- [ ] Verify bars show for each game session
- [ ] Check average line updates correctly
- [ ] Test hover tooltips on bars

### ✅ Timer Mode Tracking
- [ ] Enable Timer Mode in difficulty selector
- [ ] Complete a timer mode game
- [ ] Verify "Total Play Time" stat appears
- [ ] Check time calculation is correct

### ✅ Achievement Integration
- [ ] Unlock some achievements by playing
- [ ] Verify achievement count is correct on stats page
- [ ] Check completion percentage updates
- [ ] Verify category breakdown matches achievements page

### ✅ Data Persistence
- [ ] Play several games
- [ ] Refresh the browser page
- [ ] Verify all statistics remain
- [ ] Disconnect and reconnect wallet
- [ ] Verify stats persist for the wallet

### ✅ Multi-Wallet Support
- [ ] Record games with Wallet A
- [ ] Disconnect and connect Wallet B
- [ ] Verify Wallet B starts with clean stats
- [ ] Reconnect Wallet A
- [ ] Verify Wallet A's stats are restored

### ✅ Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all elements are readable and accessible
- [ ] Check that graphs adapt to screen size

### ✅ Edge Cases
- [ ] Lose a timer mode game (time runs out)
- [ ] Verify failed game is recorded with zero score
- [ ] Play same difficulty multiple times
- [ ] Verify stats aggregate correctly
- [ ] Use all hints in a game
- [ ] Verify hints tracked in game record

## Expected Behavior

### Empty State (No Games)
```
Shows:
- Friendly welcome message
- "Start Your Journey!" heading
- "Play Now" call-to-action button
```

### After First Game
```
Shows:
- Total Games: 1
- Win Rate: 100% (if won) or 0% (if lost)
- Statistics cards populate
- One entry in Recent Games
- One bar in efficiency graph
```

### After 10+ Games
```
Shows:
- Rich statistics across all sections
- Fully populated difficulty stats
- Meaningful efficiency graph trends
- Multiple achievements unlocked
- Clear favorite difficulty identified
```

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Statistics calculate instantly
- [ ] Smooth navigation between pages
- [ ] Graphs render without lag

## Known Limitations

1. **Graph Display**: Limited to last 20 games for performance
2. **Play Time**: Only tracked for Timer Mode games
3. **Best Time**: Only shown for difficulties with timer mode completions
4. **Date Grouping**: Groups by local date (not UTC)

## Accessibility Checks

- [ ] All text is readable (good contrast)
- [ ] Colors convey meaning (red=bad, green=good, yellow=medium)
- [ ] Hover states work on all interactive elements
- [ ] Links are clearly identifiable
- [ ] Stats cards are keyboard accessible

## Bug Reporting Template

If you find issues, report with:
```
**Issue**: Brief description
**Steps to Reproduce**: 
1. Step one
2. Step two
**Expected**: What should happen
**Actual**: What actually happened
**Browser**: Chrome/Firefox/Safari version
**Wallet**: Wallet address (last 4 chars)
```

## Success Criteria

The feature is working correctly if:
✅ All games are recorded with accurate data
✅ Statistics calculate correctly across all metrics
✅ Graphs display trends clearly
✅ Data persists across sessions
✅ Multi-wallet isolation works
✅ UI is responsive and accessible
✅ No console errors during normal use
✅ Build completes successfully

## Next Steps After Testing

Once testing is complete and issues resolved:
1. Test with real gameplay (10+ games)
2. Verify on different browsers
3. Test with different wallet providers
4. Consider deploying to testnet
5. Gather user feedback
6. Plan future enhancements based on usage

## Support

For issues or questions:
- Check `STATS_DASHBOARD.md` for implementation details
- Review console for error messages
- Verify wallet is connected
- Clear localStorage if data seems corrupted
- Restart dev server if state issues persist

