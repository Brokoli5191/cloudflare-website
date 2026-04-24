import { useEffect, useRef } from "react";

interface Props {
	startX?: number;
	startY?: number;
	onDismiss: () => void;
	onDuplicate: () => void;
}

export default function Warning({ startX = 60, startY = 60, onDismiss, onDuplicate }: Props) {
	const boxRef = useRef<HTMLDivElement>(null);
	const raf    = useRef<number>(0);

	useEffect(() => {
		const el = boxRef.current;
		if (!el) return;

		const pos = {
			x: Math.min(startX, window.innerWidth  - 200),
			y: Math.min(startY, window.innerHeight - 150),
		};
		const vel = {
			x: (Math.random() > 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.4),
			y: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.4),
		};

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
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div ref={boxRef} className="warning-popup" style={{ position: "fixed", left: startX, top: startY }}>
			<button className="warning-x" onClick={onDuplicate} aria-label="close">✕</button>
			<p className="warning-title">Warning!</p>
			<p className="warning-text">This website uses Google Fonts. You can't stop it.</p>
			<button className="warning-ok" onClick={onDismiss}>ok i agree</button>
		</div>
	);
}
