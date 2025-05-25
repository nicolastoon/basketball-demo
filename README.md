# 🏀 Basketball Visual Tracking & Clustering Challenge

Welcome to the recruiting challenge for our Basketball Consulting Project!  

---

## 🧠 Your Challenge

Choose one of two tracks — or attempt both:

### 1. 🔎 Visual Tracking (Open-ended)
Reconstruct the 30 second clip [DukeAuburn.mp4] using code — visualize player and ball movement, generate insights, or recreate possession logic. Add your own spin: shot quality, spacing metrics, or player roles.

### 2. 📊 Clustering & Pattern Recognition
Using only positional and time-series data, cluster or classify key sequences. You might identify defensive formations, pick-and-roll actions, or off-ball movement types.

---

## 📂 Data Summary: `RaptorsVHornets.json`

This file contains high-resolution SportVU player and ball tracking data from an NBA game between the **Charlotte Hornets** and **Toronto Raptors** on **January 1, 2016**. We’ve clipped the full game, which you’ll use to build your solution.

The data was recorded at **25 frames per second**, tracking all 10 players and the ball in 3D space throughout each play moment.

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

## 📝 Submission Guidelines

- Submit a GitHub repo or zipped folder with:
  - Your code (notebooks, scripts, or modules)
  - Short markdown or text file explaining your process & insight
- Optional: Add a few comments in your code to explain your thinking

---

## 🙌 Good Luck

We’re looking for creativity, technical skill, and real basketball intuition.  
Feel free to explore, experiment, and show us your perspective.

Questions? Reach out to us!
