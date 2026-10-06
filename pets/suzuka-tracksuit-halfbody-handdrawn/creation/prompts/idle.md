Create one horizontal animation strip for ChatGPT pet `suzuka-v2`, state `idle`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 head-and-tiny-torso frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Silence Suzuka exactly as reference: huge rounded head and tiny red-white track-jacket torso, compact self-contained avatar/bust silhouette with a curved lower edge. User requested a compact avatar instead of a standard full-body illustration, so do not add legs, skirt, boots or green-white racing dress. Half-lidded jade-teal eyes with low black horizontal upper lids, straight orange-brown bangs and long straight side hair, green horse ears, thin white headband, viewer-left green-yellow round ribbon with hanging green-yellow straps, viewer-right small gray diamond hair clip, pale blush cheeks, tiny open triangular orange smile, brown tail attached behind body, red sleeves and white zip-front high collar shirt. Hand-drawn heavy slightly uneven black outline, flat warm colors with subtle paper-like texture. No Japanese writing, no motion marks. Idle keeps eyes in the original half-open shape throughout and uses gentle breathing and a few pixels of hair/tail sway suited to the apps slow 6.6s loop.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact head-and-tiny-torso mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `auto`: Infer the most appropriate pet-safe style from the user request and reference images, then keep that exact style consistent across every row. User style notes: Faithfully match the supplied hand-drawn chibi avatar. Not pixel art, not polished anime, not glossy vector, not 3D. Preserve half-lidded mischievous expression, squarish straight hair ends, round tiny hands, thick irregular black ink and subtle grain..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Calm low-distraction resting loop: subtle breathing, tiny blink, slight head/body bob, and only quiet persona-preserving motion.

State requirements:
- CRITICAL: idle is the low-distraction baseline state and the first frame is also used as the reduced-motion static pet.
- Use only subtle idle motion: gentle breathing, a tiny blink, a slight head or body bob, a very small material sway, or another quiet motion that fits the pet persona.
- Keep the pet essentially in the same pose, facing direction, silhouette, markings, palette, and prop state across all 6 frames.
- Idle variation must stay calm but still read as animation; do not repeat effectively identical copies across the loop.
- Do not show waving, walking, running, jumping, talking, working, reviewing, emotional reactions, large gestures, item interactions, or new props.
- Feet, base, body, or object anchor should remain planted or nearly planted.
- The first and last frames should be very close visually so the loop feels calm and does not pop.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.
OVERRIDE FOR THIS SPECIFIC IDLE: The eyelids keep the same half-open jade eyes in ALL six frames; never close the eyes, never blink. Do not animate mouth or arms. Use one slow breathing cycle with tiny upper-torso rise and settling, gentle side-hair and attached-tail sway. First and last frames close. The app holds each idle frame 660 to 1920ms, so every pose must look relaxed and intentional on its own. Keep bottom anchor planted.

REPAIR: Previous row's final rightmost tail touched canvas edge, and frames 3/5 had unwanted thin isolated hair strands. Redraw the entire coherent six-frame strip. Make each complete avatar about 15% smaller relative to each slot; leave a wide fully-blue left/right margin outside first/last avatars and wide blue gaps between all avatars, with all six tails fully enclosed. No thin isolated strands, only the solid connected long hair and tail. Keep all eyes same half-open and mouth unchanged; gentle slight breathing only. Do not add motion marks.
