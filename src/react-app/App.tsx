import { useEffect, useState } from "react";
import "./App.css";
import BouncingButton from "./BouncingButton";
import Burst from "./Burst";
import Warning from "./Warning";

function makeCow(msg: string) {
	const d = "_".repeat(msg.length + 2);
	const l = "-".repeat(msg.length + 2);
	return [
		`   ${d}`,
		`  < ${msg} >`,
		`   ${l}`,
		`        \\   ^__^`,
		`         \\  (oo)\\_______`,
		`            (__)\\       )\\/\\`,
		`                ||----w |`,
		`                ||     ||`,
	].join("\n");
}

type Link = { label: string; href: string; cls: string; msg: string; ix: number; iy: number; vx: number; vy: number };

const ALL_LINKS: Link[] = [
	{ label: "Minecraft", href: "/minecraft", cls: "btn-green",  msg: "NastyFlea99",         ix: 80,  iy: 80,  vx: 0.7,  vy: 0.5  },
	{ label: "Projects",  href: "/Projects",  cls: "btn-blue",   msg: "github.com/brokoli5191", ix: 320, iy: 220, vx: -0.6, vy: 0.8  },
	{ label: "About",     href: "/about",     cls: "btn-pink",   msg: "i am a cow!",          ix: 150, iy: 420, vx: 0.5,  vy: -0.7 },
];

const HOME_LINK: Link = { label: "Home", href: "/", cls: "btn-yellow", msg: "win", ix: 200, iy: 160, vx: 0.6, vy: 0.55 };

function msgForPath(path: string) {
	if (path === "/secret") return "moo.";
	return ALL_LINKS.find((l) => l.href === path)?.msg ?? "win";
}

interface BurstState { x: number; y: number; href: string; msg: string }
interface WarningInstance { id: number; x: number; y: number }

export default function App() {
	const [route, setRoute]     = useState(window.location.pathname);
	const [cowMsg, setCowMsg]   = useState(msgForPath(window.location.pathname));
	const [burst, setBurst]     = useState<BurstState | null>(null);
	const [warnings, setWarnings] = useState<WarningInstance[]>([{ id: 0, x: 60, y: 60 }]);

	useEffect(() => {
		const handler = () => {
			const p = window.location.pathname;
			setRoute(p);
			setCowMsg(msgForPath(p));
		};
		window.addEventListener("popstate", handler);
		return () => window.removeEventListener("popstate", handler);
	}, []);

	function handleClick(e: React.MouseEvent, link: Link) {
		e.preventDefault();
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, href: link.href, msg: link.msg });
	}

	function handleBurstDone() {
		if (!burst) return;
		window.history.pushState({}, "", burst.href);
		setRoute(burst.href);
		setCowMsg(burst.msg);
		setBurst(null);
	}

	function dismissWarning(id: number) {
		setWarnings((prev) => prev.filter((w) => w.id !== id));
	}

	function duplicateWarning() {
		setWarnings((prev) => [
			...prev,
			{
				id: Date.now(),
				x: Math.random() * (window.innerWidth  - 240),
				y: Math.random() * (window.innerHeight - 160),
			},
		]);
	}

	const isHome = route === "/";
	const isSecret = route === "/secret";
	const buttons: Link[] = isHome || isSecret
		? (isSecret ? [HOME_LINK] : ALL_LINKS)
		: [...ALL_LINKS.filter((l) => l.href !== route), HOME_LINK];

	return (
		<>
			{warnings.map((w) => (
				<Warning
					key={w.id}
					startX={w.x}
					startY={w.y}
					onDismiss={() => dismissWarning(w.id)}
					onDuplicate={duplicateWarning}
				/>
			))}
			{burst && <Burst x={burst.x} y={burst.y} onDone={handleBurstDone} />}
			{buttons.map((l) => (
				<BouncingButton
					key={l.href + route}
					label={l.label}
					href={l.href}
					cls={l.cls}
					onClick={(e) => handleClick(e, l)}
					initialX={l.ix}
					initialY={l.iy}
					velX={l.vx}
					velY={l.vy}
				/>
			))}
			<div className="container">
				<h1 className="title">official cowsay website</h1>
				<pre className="cowsay">{makeCow(cowMsg)}</pre>
				<p
					className="footer"
					onClick={() => {
						window.history.pushState({}, "", "/secret");
						setRoute("/secret");
						setCowMsg("moo.");
					}}
				>made with ❤️ by a cow</p>
			</div>
		</>
	);
}
