# Bankshot Garden

Turn mirrors and send one seed through every flower in four small ricochet puzzles.

Run `python -m http.server 8000`, then open http://localhost:8000. No install, build, account or external assets are needed.

Click or keyboard-activate any mirror to swap its diagonal, then **Send seed**. The complete path and bloomed flowers stay visible. **Undo turn** reverses your latest edit; **Reset garden** restores the original arrangement. Choose a garden directly or use **Next garden** after solving one. There is no timer or attempt limit. Progress is memory-only and resets on reload.

The model follows grid-aligned rays with exact right-angle reflections. It is a deliberate discrete puzzle, not a physical optics simulation. Four authored gardens ship; there are no splitter, audio, custom-level or random-generation features. Routes are shown immediately rather than animated.

Run `npm test` for Node's built-in tests. They verify a concrete winning route for every garden, immutability, deterministic termination across all authored mirror configurations, and flower counting. Browser usability is reviewed separately.

This is original code and artwork. The inspiration is the trajectory play of Quantum Pong, translated into an independent setup-and-observe puzzle; no source or assets were copied.

Potential depth: carefully authored intersecting routes, limited-turn challenges and a shareable garden editor. These are future ideas, not shipped features.
