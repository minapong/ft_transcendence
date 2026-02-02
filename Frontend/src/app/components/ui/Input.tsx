import { useRef, forwardRef } from "Reactor";

interface InputProps {
    label?: string;
    error?: string;
    className?: string;
    [key: string]: any;
}

/**
 * Input Primitive
 * 
 * Responsibilities:
 * - Enforce structural shell (label, input, error)
 * - Apply energy + surface visual rules
 * - Transparently expose native <input>
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    className = "",
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="input-label" htmlFor={props.id}>
                    {label}
                </label>
            )}

            <div className={`
                fx-energy transition-all duration-300 rounded-lg
                ${error ? 'energy-none' : 'energy-low focus-within:energy-medium'}
            `}>
                <input
                    id={props.id}
                    ref={ref}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${props.id}-error` : undefined}
                    {...props}
                    className={`input-shell ${error ? 'input-shell--error' : ''} ${className}`}
                />
            </div>

            {error && (
                <span id={`${props.id}-error`} className="input-error-msg">
                    {error}
                </span>
            )}
        </div>
    );
});

export default Input;
