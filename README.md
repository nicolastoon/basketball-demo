# 🏀 Basketball Pattern Recognition Challenge

In this project, I took positional and time-series data from SportVU that tracks the basketball and each individual player on the court, and wrote a script that simulated the entire game. While simulating, the script extracted certain parts of the data, including the closest players to each other and each player's position. With each player's position, I created a heatmap of each player on the offensive and defensive ends. Combined with the most frequent players that they saw, you can dissect the information to understand strategic gameplans.

---

## 📂 Data Summary: `RaptorsVHornets.json`

This file player and ball tracking position data from SportVU. The data represents an entire NBA game between the **Charlotte Hornets** and **Toronto Raptors** on **January 1, 2016**. 

The data was recorded at **25 frames per second**, tracking all 10 players and the ball in 3D space throughout each possession.

---

## 🔍 JSON Structure

- `gameid`: Unique game identifier  
- `gamedate`: Game date  
- `events`: A list of possessions with full tracking info

Each `event` contains:
- `eventId`: Possession ID  
- `visitor` / `home`: Metadata and player rosters  
- `moments`: Time-series tracking data per frame

### 🧱 Moment Format
Each `moment` snapshot follows this structure:

```json
[
  period,
  timestamp,
  game_clock,
  shot_clock,
  null,
  [
    [team_id, player_id, x, y, z], // Ball is first, followed by all 10 players
    ...
  ]
]
```

- `team_id`: Matches one of the two teams
- `player_id`: Matches the player on the roster
- `x`, `y`: Player or ball position (in feet)
- `z`: Height (used only for the ball)

---

## 📝 Data Analysis

To analyze strategic schemes by the teams, I analyzed the heatmaps of the five players with the highest "minutes played". Note that the heatmaps record all data up until that point, not just a specific quarter.

### Q1
DeMar DeRozan most frequently positions himself on the left wing, as shown by the heatmaps. Meanwhile, the rest of his team typically positions themselves away from him, creating a weak side. This isolates DeRozan’s defender and creates an opportunity for him to score.

According to the heatmaps, the Hornets appear to be playing man-to-man defense, as their defensive positioning often overlaps with the areas where Raptors players are located (one on the right wing with DeRozan, and others closer to the paint and left wing).

Defensively, the Raptors also seem to be playing man-to-man. On offense, the Hornets are well-spread along the three-point line, as indicated by the heatmaps, with their big man, Cody Zeller, positioned at the top of the key—most likely to set screens for his teammates.

### Q2
Although the heatmaps include data from both Q1 and Q2, we can observe differences that suggest adjustments in game plans.

The Raptors' offense in Q2 is similar to Q1, with DeRozan still operating from the weak side, right wing. However, Charlotte’s offensive positioning appears to have shifted, with more activity on the wings rather than the three-point line. This suggests that Charlotte is playing closer to the basket in Q2, looking for higher-percentage scoring opportunities.

Both teams appear to be continuing their man-to-man defensive schemes.

### Q3
The Toronto Raptors seem to have adjusted their offensive approach, moving toward a setup similar to Charlotte’s in Q1—with four players spaced along the perimeter and their big man in the paint. However, the Raptors’ big man, Jonas Valančiūnas, is spending more time in the paint rather than at the top of the key.

Charlotte's offensive strategy appears largely unchanged, and both teams continue to use man-to-man defenses.

### Q4
Charlotte’s offense underwent significant changes in the fourth quarter. Their players, especially the big men, began stepping into the paint more frequently. The Raptors' offense remained similar to their Q3 approach. Defensively, both teams continued with consistent man-to-man coverage.

---

Any of the conclusions that I drew for the each of the quarters were made using the heatmaps in this project, paused at the end of each quarter. Please check them out!
