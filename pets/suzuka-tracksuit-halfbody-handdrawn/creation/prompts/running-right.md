Create one horizontal animation strip for ChatGPT pet `suzuka-v2`, state `running-right`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 8 head-and-tiny-torso frames in one left-to-right row on flat pure blue #0000FF. Treat the row as 8 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Silence Suzuka exactly as reference: huge rounded head and tiny red-white track-jacket torso, compact self-contained avatar/bust silhouette with a curved lower edge. User requested a compact avatar instead of a standard full-body illustration, so do not add legs, skirt, boots or green-white racing dress. Half-lidded jade-teal eyes with low black horizontal upper lids, straight orange-brown bangs and long straight side hair, green horse ears, thin white headband, viewer-left green-yellow round ribbon with hanging green-yellow straps, viewer-right small gray diamond hair clip, pale blush cheeks, tiny open triangular orange smile, brown tail attached behind body, red sleeves and white zip-front high collar shirt. Hand-drawn heavy slightly uneven black outline, flat warm colors with subtle paper-like texture. No Japanese writing, no motion marks. Idle keeps eyes in the original half-open shape throughout and uses gentle breathing and a few pixels of hair/tail sway suited to the apps slow 6.6s loop.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact head-and-tiny-torso mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `auto`: Infer the most appropriate pet-safe style from the user request and reference images, then keep that exact style consistent across every row. User style notes: Faithfully match the supplied hand-drawn chibi avatar. Not pixel art, not polished anime, not glossy vector, not 3D. Preserve half-lidded mischievous expression, squarish straight hair ends, round tiny hands, thick irregular black ink and subtle grain..
Animation continuity: keep apparent pet scale and baseline stable within the row unless the state itself intentionally changes vertical position, such as `jumping`. Move the pose within the slot instead of redrawing the pet larger or smaller frame to frame.

State action: Dragging-right loop: show directional movement to the right through body and limb poses only.

State requirements:
- Show directional drag movement to the right through body, limb, and prop movement only.
- The row must unmistakably face and travel right.
- The movement cadence must alternate visibly across the 8 frames instead of repeating one nearly static stride.
- Do not draw speed lines, dust clouds, floor shadows, motion trails, or detached motion effects.

Clean extraction: crisp opaque edges, safe padding, no scenery, text, guide marks, checkerboard, shadows, glows, motion blur, speed lines, dust, detached effects, stray pixels, or chroma-key colors inside the pet.

DIRECTION AND CADENCE OVERRIDE: Use this compact bust avatar only, never add legs or a lower body. Every head turns clearly toward SCREEN-RIGHT with nose, face plane and gaze to screen-right, while tiny torso leans right. Over eight phases, alternate the connected small fists visibly forward/back and let long straight hair and attached tail gently lag; phases 1/3/5/7 have leading fist forward, phases 2/4/6/8 have it back, making an obvious small pumping cadence. Keep head size/half-lidded eyes/triangular mouth stable. Preserve asymmetric ribbon on the character's original side and gray diamond clip opposite; do not flip accessories. Both hands must connect to sleeves/torso, no separate hand pixels. Maintain compact self-contained curved bottom edge. Generous blue gaps between avatars, broad blue outer margins, each entire tail/ears/hair/hand fully within canvas. No thin isolated strands or motion marks.
