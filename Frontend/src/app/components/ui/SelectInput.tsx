interface SelectInputProps {
    id?: string;
    value: string;
    onChange: (e: any) => void;
    disabled?: boolean;
    children?: any;
    label?: string;
    className?: string;
}

const SelectInput = ({ id, value, onChange, disabled, children, label }: SelectInputProps) => (
    <div className="flex flex-col gap-1.5 w-full">
        {label && (
            <label className="input-label" htmlFor={id}>
                {label}
            </label>
        )}
        <div className="relative fx-energy energy-low focus-within:energy-medium transition-all duration-300 rounded-lg">
            <select
                id={id}
                value={value}
                disabled={disabled}
                onChange={onChange}
                className="input-shell appearance-none cursor-pointer bg-black/40 border-white/10 text-cyan-50"
            >
                {children}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50">
                ▼
            </div>
        </div>
    </div>
);

export default SelectInput;
