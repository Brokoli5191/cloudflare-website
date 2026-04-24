import { useEffect, useRef, useState } from "react";

export default function Warning() {
	const [visible, setVisible] = useState(true);
	const boxRef = useRef<HTMLDivElement>(null);
	const raf    = useRef<number>(0);

	useEffect(() => {
		const el = boxRef.current;
		if (!el || !visible) return;

		const pos = { x: 60, y: 60 };
		const vel = { x: 0.8, y: 0.65 };

		el.style.left = pos.x + "px";
		el.style.top  = pos.y + "px";

		function step() {
			const maxX = window.innerWidth  - el!.offsetWidth;
			const maxY = window.innerHeight - el!.offsetHeight;

			pos.x += vel.x;
			pos.y += vel.y;

			if (pos.x <= 0 || pos.x >= maxX) { vel.x *= -1; pos.x = Math.max(0, Math.min(pos.x, maxX)); }
			if (pos.y <= 0 || pos.y >= maxY) { vel.y *= -1; pos.y = Math.max(0, Math.min(pos.y, maxY)); }

			el!.style.left = pos.x + "px";
			el!.style.top  = pos.y + "px";

			raf.current = requestAnimationFrame(step);
		}

		raf.current = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf.current);
	}, [visible]);

	if (!visible) return null;

	return (
		<div ref={boxRef} className="warning-popup" style={{ position: "fixed", left: 60, top: 60 }}>
			<p className="warning-title">Warnung!</p>
			<p className="warning-text">This website uses Google Fonts. You can't stop it.</p>
			<button className="warning-ok" onClick={() => setVisible(false)}>ok i agree</button>
		</div>
	);
}
