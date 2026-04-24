import { useEffect } from "react";

const COLORS = ["#6bcb77", "#4d96ff", "#ffd93d", "#ff6b9d", "#ff9a3c", "#c77dff", "#ff6b6b", "#ffffff"];
const COUNT = 20;

interface Props { x: number; y: number; onDone: () => void; }

export default function Burst({ x, y, onDone }: Props) {
	useEffect(() => {
		const t = setTimeout(onDone, 650);
		return () => clearTimeout(t);
	}, [onDone]);

	return (
		<div className="burst" style={{ left: x, top: y }}>
			<div className="burst-flash" />
			{Array.from({ length: COUNT }, (_, i) => (
				<div
					key={i}
					className="burst-p"
					style={{
						"--a": `${(360 / COUNT) * i}deg`,
						"--c": COLORS[i % COLORS.length],
						"--d": `${55 + Math.random() * 90}px`,
						"--s": `${7 + Math.random() * 9}px`,
						"--dur": `${0.45 + Math.random() * 0.2}s`,
					} as React.CSSProperties}
				/>
			))}
		</div>
	);
}
