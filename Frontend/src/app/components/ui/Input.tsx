import { useRef } from "Reactor";

interface InputProps {
    label?: string;
    error?: string;
    className?: string;
    ref?: any;
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
export default function Input({
    label,
    error,
    className = "",
    ref,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 px-1">
                    {label}
                </label>
            )}

            <div className="fx-energy energy-none focus-within:energy-low transition-all duration-300 rounded-lg">
                <input
                    ref={ref}
                    {...props}
                    className={`
                        w-full px-4 py-2.5 rounded-lg
                        bg-white/5 border border-white/10
                        text-white placeholder:text-white/20
                        transition-all duration-300
                        focus:bg-white/10 focus:border-white/20
                        outline-none
                        ${error ? 'border-red-500/30' : ''}
                        ${className}
                    `}
                />
            </div>

            {error && (
                <span className="text-[10px] text-red-400/80 font-medium px-1 uppercase tracking-tight">
                    {error}
                </span>
            )}
        </div>
    );
}
