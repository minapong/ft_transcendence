import { navigate } from "Reactor";

/**
 * Button Component
 * 
 * A reusable, fully-typed button component that integrates with the design system.
 * Supports all design system button variants, sizes, and states.
 */

// ========================================
// Types
// ========================================

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "game"
	| "hero"
	| "glass";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
	/** Button content (auto-injected by Reactor JSX) */
	children?: any;

	/** Visual variant - determines colors and style */
	variant?: ButtonVariant;

	/** Size of the button */
	size?: ButtonSize;

	/** Click handler */
	onClick?: (e: MouseEvent) => void;

	/** Disabled state */
	disabled?: boolean;

	/** Loading state - shows loading text and disables button */
	loading?: boolean;

	/** Full width button */
	fullWidth?: boolean;

	/** HTML button type */
	type?: "button" | "submit" | "reset";

	/** Additional CSS classes */
	className?: string;

	/** Navigation path - if provided, button acts as a link */
	href?: string;

	/** Icon to show before text */
	iconBefore?: any;

	/** Icon to show after text */
	iconAfter?: any;

	/** Custom data attributes */
	[key: `data-${string}`]: any;
	onPointerDown?: (e: PointerEvent) => void;
	onMouseDown?: (e: MouseEvent) => void;
}

// ========================================
// Component
// ========================================

export default function Button({
	children,
	variant = "primary",
	size = "md",
	onClick,
	disabled = false,
	loading = false,
	fullWidth = false,
	type = "button",
	className = "",
	href,
	iconBefore,
	iconAfter,
	...props
}: ButtonProps) {

	// Build class names
	const classes = [
		"btn",
		`btn-${variant}`,
		`btn-${size}`,
		fullWidth && "w-full",
		className,
	]
		.filter(Boolean)
		.join(" ");

	// Handle click with navigation support
	const handleClick = (e: MouseEvent) => {
		if (disabled || loading) {
			e.preventDefault();
			return;
		}

		if (href) {
			e.preventDefault();
			navigate(href);
			return;
		}

		onClick?.(e);
	};

	// Determine if button should be disabled
	const isDisabled = disabled || loading;

	return (
		<button
			type={type}
			className={classes}
			onClick={handleClick}
			disabled={isDisabled}
			aria-busy={loading}
			{...props}
		>
			{iconBefore && <span className="btn-icon-before">{iconBefore}</span>}

			{loading ? (
				<span className="btn-loading">
					<span className="btn-spinner" aria-hidden="true" />
					Loading...
				</span>
			) : (
				children
			)}

			{iconAfter && !loading && <span className="btn-icon-after">{iconAfter}</span>}
		</button>
	);
}

// ========================================
// Convenience Components
// ========================================

/**
 * Primary button - main CTA
 */
export function PrimaryButton(props: Omit<ButtonProps, "variant">) {
	return <Button {...props} variant="primary" />;
}

/**
 * Secondary button - alternative actions
 */
export function SecondaryButton(props: Omit<ButtonProps, "variant">) {
	return <Button {...props} variant="secondary" />;
}

/**
 * Success button - positive confirmations
 */
export function SuccessButton(props: Omit<ButtonProps, "variant">) {
	return <Button {...props} variant="success" />;
}

/**
 * Danger button - destructive actions
 */
export function DangerButton(props: Omit<ButtonProps, "variant">) {
	return <Button {...props} variant="danger" />;
}

/**
 * Game button - game control buttons
 */
export function GameButton(props: Omit<ButtonProps, "variant">) {
	return <Button {...props} variant="game" />;
}

/**
 * Link button - navigates to a route
 */
export function LinkButton({ href, children, ...props }: ButtonProps & { href: string }) {
	return <Button {...props} href={href}>{children}</Button>;
}