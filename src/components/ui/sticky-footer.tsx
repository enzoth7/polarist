import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import {
	InstagramIcon,
	YoutubeIcon,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { Link } from 'react-router-dom';
import { routes } from '@/lib/routes';

// Adapted the User's code to framer-motion and the Polarist Brand!

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	return (
		<footer
			className={cn('relative h-[550px] md:h-[360px] w-full overflow-clip', className)}
			style={{ background: '#FFFFFF' }}
			{...props}
		>
			{/* Sticky interno — sube desde abajo a medida que se scrollea, sin interceptar el scroll */}
			<div
				className="sticky bottom-0 h-[550px] md:h-[360px] w-full"
				style={{ background: '#FFFFFF' }}
			>
				<div className="relative flex size-full flex-col justify-between gap-5 border-t border-black/10 px-4 py-8 md:px-12">
					<div
						aria-hidden
						className="absolute inset-0 isolate z-0 overflow-hidden pointer-events-none"
					>
						<div className="absolute top-0 left-0 h-[600px] w-[600px] -translate-y-[20%] -translate-x-[20%] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(202,254,91,0.25) 0%, transparent 70%)' }} />
					</div>
					<div className="mt-6 flex flex-col gap-8 md:flex-row xl:mt-0 z-10 relative">
						<AnimatedContainer className="w-full max-w-sm min-w-[280px] space-y-4">
							<BrandLogo showLabel={false} imageClassName="h-10 w-10 rounded-md" />
							<p className="mt-6 text-sm text-black/70 md:mt-0 font-medium">
								Asesoramos e implementamos Agentes de IA para transformar, acelerar y mejorar tu negocio.
							</p>
							<div className="flex gap-4 pt-2">
								{socialLinks.map((link) => (
									<a
										href={link.href}
										key={link.title}
										target="_blank"
										rel="noopener noreferrer"
										className="text-black/50 hover:text-black transition-colors duration-200"
										title={link.title}
									>
										<link.icon className="size-5" />
									</a>
								))}
							</div>
						</AnimatedContainer>
						{footerLinkGroups.map((group, index) => (
							<AnimatedContainer
								key={group.label}
								delay={0.1 + index * 0.1}
								className="w-full"
							>
								<div className="mb-8 md:mb-0">
									<h3 className="text-sm uppercase tracking-wider font-bold text-black">{group.label}</h3>
									<ul className="mt-4 space-y-3 text-sm md:text-xs lg:text-sm">
										{group.links.map((link) => (
											<li key={link.title}>
												<Link
													to={link.href}
													className="inline-flex items-center transition-all duration-300 font-medium text-black/60 hover:text-black"
												>
													{link.icon && <link.icon className="me-1 size-4" />}
													{link.title}
												</Link>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>
					<div className="flex flex-col items-center justify-center gap-2 border-t border-black/10 pt-6 pb-2 text-sm z-10 relative text-black/50 font-medium">
						<p>© 2026 Polarist. Todos los derechos reservados.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

const LinkedinCustomIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		className={className}
		viewBox="0 0 16 16"
	>
		<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
	</svg>
);

const socialLinks = [
	{ title: 'Instagram', href: 'https://instagram.com/polarist.app/', icon: InstagramIcon },
	{ title: 'YouTube', href: 'https://www.youtube.com/@Polarist_App', icon: YoutubeIcon },
	{ title: 'LinkedIn', href: 'https://www.linkedin.com/company/polarist/', icon: LinkedinCustomIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Plataforma',
		links: [
			{ title: 'Términos y Condiciones', href: routes.terms || '#' },
			{ title: 'Política de Privacidad', href: routes.privacy || '#' },
		],
	},
	{
		label: 'Empresa',
		links: [
			{ title: '¿Quiénes somos?', href: routes.about || '#' },
			{ title: 'Contacto', href: routes.contact || '#' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}
