# React Bits sticker peel

Source: https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Animations/StickerPeel
Retrieved 2026-11-17. Copyright David Haz; license retained in LICENSE.md.

Local changes add controlled scroll progress, signal texture readiness for the original-portrait fallback, and skip pointer lighting updates in scroll mode. The portrait integration disables dragging, hover peeling, and the intro animation.

Live canvas textures update the gaze in place without recreating the WebGL canvas. Readiness is signaled only after the first rendered frame.
