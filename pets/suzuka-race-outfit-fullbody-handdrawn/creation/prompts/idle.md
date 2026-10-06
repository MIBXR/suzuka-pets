Create one horizontal animation strip for ChatGPT pet `silence-suzuka-chibi`, state `idle`.

Use the attached canonical base for identity. Use the attached layout guide only for slot count, spacing, centering, and padding; do not draw the guide.

Output exactly 6 full-body frames in one left-to-right row on flat pure user-selected #FF00FF. Treat the row as 6 invisible equal-width slots: one centered complete pose per slot, evenly spaced, with no overlap, clipping, empty slots, labels, or borders.

Identity: same pet in every frame: Silence Suzuka from Uma Musume, faithful official reference. Strict cute two-head-tall chibi with oversized rounded head, tiny body, stubby limbs. Orange chestnut straight long hair with blunt bangs and attached matching horse tail, turquoise eyes, green horse-ear covers, white green headband, right ear green gold rosette; white green gold-trim racing dress, dark purple bow/gloves/tights, right white shoe left brown shoe with green bows. User supplied six style references: simple handdrawn dark contours, rounded faces, big simple eyes, visible peach rosy blush marks, playful expressive mouth, large grouped hair shapes with sparse highlights, muted flat colors and very minimal shading. User explicitly changed FROM pixel art TO this handdrawn chibi style. No text, background scribbles or props from style references.. Preserve silhouette, face, proportions, markings, palette, material, style, and props.
Style: Pet-safe sprite: compact full-body mascot, readable in a 192x208 cell, clear silhouette, simple face, stable palette/materials, and crisp edges for chroma-key extraction. Style `auto`: Infer the most appropriate pet-safe style from the user request and reference images, then keep that exact style consistent across every row. User style notes: Cute handdrawn Japanese chibi sticker illustration matching supplied images. Slightly imperfect warm dark outlines, flat muted cel colors, sparse soft blush, very simple large eyes; head dominates silhouette, tiny two-head-tall body. No pixel grid, no gradients, no glossy rendered texture..
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
