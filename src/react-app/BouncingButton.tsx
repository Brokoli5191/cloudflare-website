import { useEffect, useRef } from "react";

interface Props {
	label: string;
	href: string;
	cls: string;
	onClick: (e: React.MouseEvent) => void;
	initialX: number;
	initialY: number;
	velX: number;
	velY: number;
}

export default function BouncingButton({ label, href, cls, onClick, initialX, initialY, velX, velY }: Props) {
	const ref = useRef<HTMLAnchorElement>(null);
	const raf = useRef<number>(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const clampX = Math.max(0, Math.min(initialX, window.innerWidth  - 160));
		const clampY = Math.max(0, Math.min(initialY, window.innerHeight - 60));
		const pos = { x: clampX, y: clampY };
		const vel = { x: velX, y: velY };

		el.style.left = pos.x + "px";
		el.style.top  = pos.y + "px";

		function step() {
			// re-clamp on resize (orientation change etc.)
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
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<a
			ref={ref}
			href={href}
			className={`nav-btn ${cls}`}
			style={{ position: "fixed", left: initialX, top: initialY, zIndex: 10 }}
			onClick={onClick}
		>
			{label}
		</a>
	);
}
